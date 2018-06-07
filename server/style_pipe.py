import multiprocessing as mp
from multiprocessing import Pipe, Queue, Process

transferQueue = Queue()

def append_transfer(styleOp, args, childConn):
    transferQueue.put([styleOp, args, childConn])

def process_transfer(queue):
    while True:
        if queue.empty() != True:
            op, args, conn = queue.get()
            op(args)
            #Todo: add more error information to the output
            conn.send("process Ok")
            conn.close()
    

def run():
    p = Process(target=process_transfer, args=(transferQueue,))
    p.start()