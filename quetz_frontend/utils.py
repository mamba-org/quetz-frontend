import os
import shutil

def clean_dir(dir_path):
    file_list = os.listdir(dir_path)

    for file in file_list:
        file_path = os.path.join(dir_path, file)

        if os.path.isfile(file_path) :
            os.remove(file_path)

        elif os.path.islink(file_path) :
            os.remove(file_path)

        elif os.path.isdir(file_path) :
            clean_dir(file_path)
            shutil.rmtree(file_path)
            