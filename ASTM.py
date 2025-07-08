data = """

  6A  10.5 × 2.0
  8A  13.8 × 2.3
 10A  17.3 × 2.3
 15A  21.7 × 2.8
 20A  27.2 × 2.8
 25A  34.0 × 3.2
 32A  42.7 × 3.5
 40A  48.6 × 3.5
 50A  60.5 × 3.8
 65A  76.3 × 4.2
 80A  89.1 × 4.2
 90A  101.6 × 4.2
100A  114.3 × 4.5
125A  139.8 × 4.5
150A  165.2 × 5.0
175A  190.7 × 5.3
200A  216.3 × 5.8
225A  241.8 × 6.2
250A  267.4 × 6.6
300A  318.5 × 6.9
350A  355.6 × 7.9
400A  406.4 × 7.9
450A  457.2 × 7.9
500A  508.0 × 7.9

"""

def parse_and_format(input_text):
    sizes_lines = []
    for line in input_text.strip().split('\n'):
        size, od_str, _, t_str = line.split()
        od = float(od_str)
        t = float(t_str.replace('×','').replace('*',''))
        key = f"{od}*{t}"
        sizes_lines.append(f"  '{size}': {{ '{key}' : {{ od: {od}, t: {t} }} }},")
    sizes_body = "\n".join(sizes_lines)
    result = (
        "{\n"
        "  id: 'SGP',\n"
        "  standard: 'JIS G 3452',\n"
        "  materialId: ['SGP'],\n"
        "  sizeType: 'JIS',\n"
        "  sizes: {\n"
        f"{sizes_body}\n"
        "  },\n"
        "},"
    )
    return result

print(parse_and_format(data))
