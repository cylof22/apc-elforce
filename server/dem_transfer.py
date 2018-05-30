from neural_style import neuralstyle
from neural_style_preview import style_preview
from fast_style import faststyle
import os

def art_style_demo():
    contentFileName = "./demo.jpg"
    styleFileName = "BtoA_demo.jpg"
    outputPath = "./testok.jpg"
    iterations = 10
    model = "./"

    args = {"content": contentFileName, "styles": {styleFileName}, "output": outputPath, "iterations": iterations,
        "network": model, "content_weight": 0.9, "style_weight": 0.1}

    styleOp = neuralstyle(args)
    _, error = styleOp.train()

    if error is not None:
        print("transfer error")

def art_style_preview_demo():
    contentFileName = "./demo.jpg"
    styleFileName = "BtoA_demo.jpg"
    outputPath = "./testok.jpg"

    style_preview(contentFileName, styleFileName, outputPath)

def fast_style_demo():
    contentFileName = './demo.jpg'
    outputPath = "./test_fast.jpg"
    modelPath = "./models/rain_princess.ckpt"

    args = { "in-path": contentFileName, "out-path": outputPath, "checkpoint_dir": modelPath}    
    fastOp = faststyle(args)

if __name__ == '__main__':
    fast_style_demo()