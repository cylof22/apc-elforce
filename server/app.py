from flask import Flask, request, jsonify, send_file, send_from_directory
from base64 import b64decode
from os.path import basename, join
import urllib
from collections import namedtuple
import ssl

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg',])

import tensorflow as tf
tf.set_random_seed(19)

from neural_style import neuralstyle
from artist_style import cyclegan
from fast_style import faststyle
from argparse import ArgumentParser

from imageio import imread, imwrite

from skimage.transform import resize

app = Flask(__name__)

MODEL_DIR = ''
CHECKPOINT_DIR = ''

PROTOCOL = 'https://'
HOST_DOMAIN = 'tulian.17dodo.com'

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/content', methods=['POST', 'OPTIONS'])
def uploadContent():
    contentFile = request.files.get('file')
    if contentFile:
        contentname = './contents/' + contentFile.filename
        contentFile.save(contentname)
        return PROTOCOL + HOST_DOMAIN + '/preview/contents/' + contentFile.filename

    print("Bad Content File")
    return 'Upload Content fails'

@app.route('/style', methods=['POST', 'OPTIONS'])
def uploadStyle():
    styleFile = request.files.get('file')
    if styleFile:
        stylename = './styles/' + styleFile.filename
        styleFile.save(stylename)
        return PROTOCOL + HOST_DOMAIN + '/preview/styles/' + styleFile.filename
    print("Bad Style file")
    return 'Upload Style Fails'

@app.route('/preview/styles/<path:filename>')
def styleDisplay(filename):
    return send_from_directory('styles', filename, as_attachment=True)

@app.route('/preview/contents/<path:filename>')
def contentDisplay(filename):
    return send_from_directory('contents', filename, as_attachment=True)

@app.route('/preview/outputs/<path:filename>')
def outputDisplay(filename):
    return send_from_directory('outputs', filename, as_attachment=True)

@app.route('/facialTransfer', methods=[''])
def facialTransfer():
    return NotImplemented

@app.route('/styleTransfer', methods=['GET', 'OPTIONS']) 
def style_transfer(): 
    contentArg = request.args.get('content')
    contentPath = b64decode(contentArg)
    contentPath = contentPath.decode('utf-8')
    content_file = urllib.request.urlretrieve(contentPath)[0]

    styleArg = request.args.get('style')
    stylePath = b64decode(styleArg)
    stylePath = stylePath.decode('utf-8')
    style_file = urllib.request.urlretrieve(stylePath)[0]

    iterations = request.args.get('iterations', type=int)
    if(iterations is None):
        iterations = 100

    # Construct the output file name
    outputname = basename(stylePath) + '_' + basename(contentPath) + '.jpg'
    outputPath = './outputs/' + outputname

    args = {"content": content_file, "styles": {style_file}, "output": outputPath, "iterations": iterations,
        'network': MODEL_DIR}
    
    styleOp = neuralstyle(args)

    # Todo: How to add the custom error information to the response
    if styleOp.error is not None:
        return styleOp.error

    # Clear the temporary content file
    urllib.request.urlcleanup()

    return PROTOCOL + HOST_DOMAIN + '/preview/outputs/' + outputname

@app.route('/fixedStyle', methods=['GET','OPTIONS'])
def fixed_style():
    # parse the model type
    style = request.args.get("style")
    modelPath = './models/' + style + ".ckpt"

    # Parse the content arguments
    contentArg = request.args.get('content')
    contentPath = b64decode(contentArg)
    contentPath = contentPath.decode('utf-8')
    content_file = urllib.request.urlretrieve(contentPath)[0]

    outputfilename = style + '_' + basename(contentPath)
    outputPath = './outputs/' + outputfilename

    contentPath = './contents/' + basename(contentPath)

    args = { "in-path": content_file, "out-path": outputPath, "checkpoint_dir": modelPath}    
    faststyle(args)

    # Clear the temporary content file
    urllib.request.urlcleanup()

    return PROTOCOL + HOST_DOMAIN + '/preview/outputs/' + outputfilename


@app.route('/artistStyle', methods=['GET','OPTIONS'])
def art_style():
    # Get the artist name
    model_dir = None
    style = request.args.get('artist')
    model_dir = CHECKPOINT_DIR + style
    
    # Parse the content arguments
    contentArg = request.args.get('content')
    contentPath = b64decode(contentArg)
    contentPath = contentPath.decode('utf-8')
    content_file = urllib.request.urlretrieve(contentPath)[0]

    im = imread(content_file)
    width, height, _ = im.shape

    fine_width = width
    if (width % 4) != 0:
        fine_width = width - width % 4

    fine_height = height
    if (height % 4) != 0:
        fine_height = height - height % 4

    outputName = style + basename(contentPath)
    outputPath = './outputs/'
    OPTIONS = namedtuple('OPTIONS', 'fine_width fine_height input_nc output_nc\
                            use_resnet use_lsgan sample_file checkpoint_dir output_dir \
                            ngf ndf phase direction \
                            output_file')
    
    args = OPTIONS._make((fine_width, fine_height, 3, 3, True, True, content_file, model_dir, './outputs/',
            64, 64,'test', 'BtoA', outputName))

    cyclegan(args)
    
    # resize the file to the original image size
    outputFile = outputPath + outputName
    img = imread(outputFile)
    rsImg = resize(img, [width,height])
    imwrite(outputFile, rsImg)

    # Clear the temporary content file
    urllib.request.urlcleanup()

    return PROTOCOL + HOST_DOMAIN + '/preview/outputs/' + outputName

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

def build_parser():
    parser = ArgumentParser()
    parser.add_argument('--host',
            dest='host', help='style server host',
            metavar='HOST', default='0.0.0.0', required=False)
    parser.add_argument('--port',
            dest='port', help='style server port',
            metavar='PORT', default='443', required=False)
    parser.add_argument('--modeldir', 
            dest='modeldir', help='style transfer directory',
            metavar='MODEL', default='./', required=False)
    parser.add_argument('--checkpointdir',
            dest='checkpointdir', help='artist transfer checkpoint director', 
            metavar='CHECKPOINTDIR', default='./checkpoint/',required=False)
    return parser
    
if __name__ == '__main__':
    parser = build_parser()
    options = parser.parse_args()

    MODEL_DIR = options.modeldir
    CHECKPOINT_DIR = options.checkpointdir

    context = ssl.SSLContext(ssl.PROTOCOL_SSLv23)
    context.load_cert_chain('./certification/server.pem', './certification/server.key')

    app.run(host=options.host,port=int(options.port), ssl_context=context, threaded=True, debug=True)