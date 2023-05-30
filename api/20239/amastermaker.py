import os
import json

def merge_json_files(input_folder, output_file):
    merged_data = {"courses": []}

    for file_name in os.listdir(input_folder):
        if file_name.endswith(".json"):
            with open(os.path.join(input_folder, file_name), "r") as f:
                data = json.load(f)
                merged_data["courses"].extend(data["courses"])

    with open(output_file, "w") as f:
        json.dump(merged_data, f)


if __name__ == '__main__':
    merge_json_files(R"C:\Users\admin\Documents\Extras\vsCode_stuff\Angular19\timetablePrototype2\src\api\20239", "acoursesMASTER.json")