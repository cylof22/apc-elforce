from flask import Flask, request, jsonify, send_file, send_from_directory
from base64 import b64decode
from os.path import basename, join
import urllib
from collections import namedtuple
from PIL import Image

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg',])

import tensorflow as tf
tf.set_random_seed(19)

from neural_style import neuralstyle
from argparse import ArgumentParser

app = Flask(__name__)

MODEL_DIR = ''
CHECKPOINT_DIR = ''

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/content', methods=['POST'])
def uploadContent():
    contentFile = request.files.get('file')
    if contentFile:
        contentname = contentFile.filename
        contentFile.save(join('./contents', contentname))
        return 'http://localhost:5000/preview/contents/' + contentname

    return 'Upload Content fails'

@app.route('/style', methods=['POST'])
def uploadStyle():
    styleFile = request.files.get('file')
    if styleFile:
        stylename = styleFile.filename
        styleFile.save(join('./styles', stylename))
        return 'http://localhost:5000/preview/styles/' + stylename
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

@app.route('/styleTransfer', methods=['GET']) 
def style_transfer(): 
    contentArg = request.args.get('content')
    styleArg = request.args.get('style')

    iterations = request.args.get('iterations', type=int)
    if(iterations is None):
        iterations = 10

    contentPath = b64decode(contentArg)
    stylePath = b64decode(styleArg)

    contentPath = contentPath.decode('utf-8')
    stylePath = stylePath.decode('utf-8')

    # Download the style to local machine
    styleFileName = './styles/' + basename(stylePath)
    contentFileName = './contents/' + basename(contentPath)

    # Construct the output file name
    outputname = basename(stylePath) + '_' + basename(contentPath) + '.png'
    outputPath = './outputs/' + outputname

    args = {"content": contentFileName, "styles": {styleFileName}, "output": outputPath, "iterations": iterations,
        'network': MODEL_DIR}
    
    styleOp = neuralstyle(args)
    _, error = styleOp.train()

    # Todo: How to add the custom error information to the response
    if error is not None:
        urllib.request.urlcleanup()
        return error

    # Todo: Clear the temporary style and content files
    urllib.request.urlcleanup()

    return "http://localhost:5000/preview/outputs/" + outputname

@app.route('/artistStyle', methods=['GET'])
def art_style():
    # Get the artist name
    model_dir = None
    style = request.args.get('artist')
    model_dir = CHECKPOINT_DIR + style
    
    contentArg = request.args.get('content')
    contentPath = b64decode(contentArg)
    contentPath = contentPath.decode('utf-8')
    content_file = urllib.request.urlretrieve(contentPath)[0]

    im = Image.open(content_file)
    width, height = im.size

    fine_width = width
    if (width % 4) != 0:
        fine_width = width - width % 4

    fine_height = height
    if (height % 4) != 0:
        fine_height = height - height % 4

    output_file = style + basename(contentPath)
    OPTIONS = namedtuple('OPTIONS', 'fine_width fine_height input_nc output_nc\
                              L1_lambda lr use_resnet use_lsgan dataset_dir sample_file checkpoint_dir output_dir \
                              ngf ndf max_size phase direction \
                              beta1 epoch epoch_step batch_size train_size output_file')
    
    args = OPTIONS._make((fine_width, fine_height, 3, 3, 10.0, 0.0002, True, True, '', content_file, model_dir, './data/outputs/',64, 64, 50, 'test', 'BtoA',
                         0.5, 200, 100, 1, 1e8, output_file))

    tfconfig = tf.ConfigProto(allow_soft_placement=True)
    tfconfig.gpu_options.allow_growth = True

    outputPath = None
    tf.reset_default_graph()
    with tf.Session(config=tfconfig) as sess:
        model = cyclegan(sess, args)
        outputPath = model.test(args)
    
    # resize the file to the original image size
    img = Image.open(outputPath)
    rsImg = img.resize((width,height))
    rsImg.save(outputPath)

     # Clear the temporary content file
    urllib.request.urlcleanup()

    return "http://localhost:5000/outputs" + output_file

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', '*')
    return response

def build_parser():
    parser = ArgumentParser()
    parser.add_argument('--host',
            dest='host', help='style server host',
            metavar='HOST', default='0.0.0.0', required=False)
    parser.add_argument('--port',
            dest='port', help='style server port',
            metavar='PORT', default='5000', required=False)
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

    ssl = ('./certification/server.crt', './certification/server.key')
    app.run(host=options.host,port=int(options.port))