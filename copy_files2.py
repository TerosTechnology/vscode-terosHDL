import os
import shutil

import os
import shutil

def copy_files_except_extensions(src_dir, out_dir, excluded_extensions):
    """
    Copy files from the source directory to the output directory, excluding files with specified extensions.

    Args:
        src_dir (str): The path to the source directory.
        out_dir (str): The path to the output directory.
        excluded_extensions (list): A list of file extensions to exclude.

    Returns:
        None
    """
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if not any(file.endswith(ext) for ext in excluded_extensions):
                src_path = os.path.abspath(os.path.join(root, file))

                src_path_parent_dir = os.path.relpath(root, src_dir)
                if len(src_path_parent_dir.split(os.sep)) > 1:
                    src_path_parent_dir = f"{os.sep}".join(src_path_parent_dir.split(os.sep)[1:])
                else:
                    src_path_parent_dir = "."

                complete_dest_path = os.path.abspath(os.path.join(out_dir, src_path_parent_dir, file))

                os.makedirs(os.path.dirname(complete_dest_path), exist_ok=True)
                shutil.copy2(src_path, complete_dest_path)

src_directory = '../colibri/src'
out_directory = 'build'

excluded_extensions = ['.ts', '.js', '.log']

copy_files_except_extensions(src_directory, out_directory, excluded_extensions)

print("Files copied successfully!")
