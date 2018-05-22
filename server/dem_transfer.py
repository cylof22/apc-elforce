
from neural_style import neuralstyle
from neural_style_preview import style_preview

def art_style_demo():
    contentFileName = "./demo.jpg"
    styleFileName = "BtoA_雪色流光-洛阳市西城区西大街.jpg"
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
    styleFileName = "BtoA_雪色流光-洛阳市西城区西大街.jpg"
    outputPath = "./testok.jpg"

    style_preview(contentFileName, styleFileName, outputPath)

if __name__ == '__main__':
    art_style_preview_demo()