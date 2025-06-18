from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def gcd(a, b):
    """Compute GCD using the Euclidean algorithm with absolute values."""
    a, b = abs(a), abs(b)
    while b:
        a, b = b, a % b
    return a

def lcm(a, b):
    """Compute LCM using GCD with absolute values."""
    g = gcd(a, b)
    if g == 0:
        return 0  # LCM is undefined if GCD is 0
    return abs(a * b) // g

def gcd_list(numbers):
    """Compute GCD of a list of numbers."""
    from functools import reduce
    if len(numbers) == 1:
        return abs(numbers[0])
    if all(n == 0 for n in numbers):
        return 0  # Convention: GCD(0,0,...) = 0
    return reduce(gcd, numbers)

def lcm_list(numbers):
    """Compute LCM of a list of numbers."""
    from functools import reduce
    if len(numbers) == 1:
        return abs(numbers[0])
    if any(n == 0 for n in numbers):
        return 0  # LCM is undefined if any number is 0
    return reduce(lcm, numbers)

def validate_numbers(data):
    """Validate input JSON for a list of integers."""
    nums = data.get('numbers')
    if not isinstance(nums, list) or len(nums) < 1:
        return None, "Provide a list of at least one number."
    try:
        nums = [int(n) for n in nums]
        return nums, None
    except (TypeError, ValueError):
        return None, "Invalid input. Only integers allowed."

def prime_factors(n):
    """Return the list of prime factors of |n|."""
    n = abs(n)
    if n == 0:
        return []
    i = 2
    factors = []
    while i * i <= n:
        while n % i == 0:
            factors.append(i)
            n //= i
        i += 1
    if n > 1:
        factors.append(n)
    return factors

def gcd_steps(a, b):
    """Return steps for Euclidean algorithm with absolute values."""
    original_a, original_b = a, b
    a, b = abs(a), abs(b)
    steps = [f"Using absolute values: |{original_a}| = {a}, |{original_b}| = {b}"]
    if a == 0 and b == 0:
        steps.append("GCD(0, 0) is undefined, returning 0 by convention")
        return steps
    while b:
        steps.append(f"GCD({a}, {b}) → {a} % {b} = {a % b}")
        a, b = b, a % b
    steps.append(f"GCD = {a}")
    return steps

def gcd_list_steps(numbers):
    """GCD with steps for a list."""
    from functools import reduce
    if len(numbers) == 1:
        return abs(numbers[0]), [f"GCD({numbers[0]}) = |{numbers[0]}| = {abs(numbers[0])}"]
    if all(n == 0 for n in numbers):
        return 0, ["All inputs are 0, GCD is 0 by convention"]
    steps = []
    def _gcd(a, b):
        s = gcd_steps(a, b)
        steps.extend(s)
        return gcd(a, b)
    result = reduce(_gcd, numbers)
    return result, steps

def lcm_steps(a, b):
    """Return steps for LCM using GCD with absolute values."""
    g = gcd(a, b)
    steps = gcd_steps(a, b)
    if g == 0:
        steps.append(f"LCM({a}, {b}) is undefined since GCD = 0")
        return 0, steps
    steps.append(f"LCM({a}, {b}) = |{a} × {b}| / GCD = {abs(a*b)} / {g} = {abs(a*b)//g}")
    return abs(a*b)//g, steps

def lcm_list_steps(numbers):
    """LCM with steps for a list."""
    from functools import reduce
    if len(numbers) == 1:
        return abs(numbers[0]), [f"LCM({numbers[0]}) = |{numbers[0]}| = {abs(numbers[0])}"]
    if any(n == 0 for n in numbers):
        return 0, ["LCM is undefined if any number is 0"]
    steps = []
    def _lcm(a, b):
        l, s = lcm_steps(a, b)
        steps.extend(s)
        return l
    result = reduce(_lcm, numbers)
    return result, steps

def chart_data(type_, numbers, result):
    """Prepare chart data for visualization."""
    import math
    labels = []
    datasets = []
    abs_numbers = [abs(n) for n in numbers]
    if type_ == 'gcd':
        if all(n == 0 for n in numbers):
            return {'labels': [], 'datasets': []}
        min_n = min(abs_numbers)
        divisors = [i for i in range(1, min_n+1) if all(n % i == 0 for n in abs_numbers if n != 0)]
        labels = [str(i) for i in divisors]
        datasets = [{
            'label': 'Common Divisors',
            'data': [1]*len(divisors),
            'backgroundColor': ['#0078d7' if int(l)==result else '#b3e0ff' for l in labels]
        }]
    elif type_ == 'lcm':
        if any(n == 0 for n in numbers):
            return {'labels': [], 'datasets': []}
        max_n = max(abs_numbers)
        lcm_val = result
        multiples = [lcm_val * i for i in range(1, 6)] if lcm_val != 0 else []
        labels = [str(m) for m in multiples]
        datasets = [{
            'label': 'Common Multiples',
            'data': [1]*len(multiples),
            'backgroundColor': ['#0078d7' if int(l)==lcm_val else '#b3e0ff' for l in labels]
        }]
    return {'labels': labels, 'datasets': datasets}

@app.route('/api/gcd', methods=['POST'])
def api_gcd():
    data = request.get_json()
    nums, error = validate_numbers(data)
    if error:
        return jsonify({'error': error}), 400
    result, steps = gcd_list_steps(nums)
    pf = {str(n): prime_factors(n) for n in nums}
    chart = chart_data('gcd', nums, result)
    return jsonify({'result': result, 'steps': steps, 'prime_factors': pf, 'chart': chart})

@app.route('/api/lcm', methods=['POST'])
def api_lcm():
    data = request.get_json()
    nums, error = validate_numbers(data)
    if error:
        return jsonify({'error': error}), 400
    result, steps = lcm_list_steps(nums)
    pf = {str(n): prime_factors(n) for n in nums}
    chart = chart_data('lcm', nums, result)
    return jsonify({'result': result, 'steps': steps, 'prime_factors': pf, 'chart': chart})

if __name__ == '__main__':
    app.run(debug=True)