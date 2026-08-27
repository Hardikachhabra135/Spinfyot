from PIL import Image
import sys
def remove_white_bg(input_path, output_path, tolerance=25):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    for item in data:
        if item[0] > 255 - tolerance and item[1] > 255 - tolerance and item[2] > 255 - tolerance:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)
    img.save(output_path, "PNG")
remove_white_bg(sys.argv[1], sys.argv[2])
