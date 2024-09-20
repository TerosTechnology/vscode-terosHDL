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
                src_path = os.path.join(root, file)
                relative_path = os.path.relpath(src_path, src_dir)
                dest_path = os.path.join(out_dir, relative_path)

                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                shutil.copy2(src_path, dest_path)

src_directory = 'src/colibri'
out_directory = 'out/colibri'

excluded_extensions = ['.ts', '.js', '.log']

copy_files_except_extensions(src_directory, out_directory, excluded_extensions)

print("Files copied successfully!")
