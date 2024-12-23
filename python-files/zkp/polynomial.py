import random
import hashlib
from math import ceil, sqrt
from typing import List, Tuple, Dict

class Polynomial:

    @staticmethod
    def get_vk(class_value: int, mappings) -> int:
        for mapping in mappings:
            if mapping["class"] == class_value:
                return mapping["vk"]
        return None  # Return None if class not found


    @staticmethod
    def hash_and_extract_lower_4_bytes(input_number, p):
        """
        Computes the SHA-256 hash of an integer, extracts the lower 4 bytes,
        and returns the result modulo p as a non-negative integer.

        :param input_number: The input integer
        :param p: The modulo value
        :return: Result after extracting lower 4 bytes and applying modulo p
        """
        # Convert the input number to a string
        input_data = str(input_number)
    
        # Compute the SHA-256 hash
        hash_obj = hashlib.sha256()
        hash_obj.update(input_data.encode())
        hash_str = hash_obj.hexdigest()

        # Extract the last 4 bytes (8 hex characters)
        last_4_bytes_hex = hash_str[-8:]

        # Convert the hex string to an integer
        result = int(last_4_bytes_hex, 16)

        # Apply modulo operation
        result %= p

        # Ensure positive result for modulo
        if result < 0:
            result += p

        return result

    @staticmethod
    def e_func(a, b, g, p):
        """
        Calculates the e_func value based on the inputs.
        :param a: First input value
        :param b: Second input value
        :param g: Value for modular division
        :param p: Modulus
        :return: The result of the e_func calculation
        """
        buf1 = (a * Polynomial.pInverse(g, p)) % p
        buf2 = (b * Polynomial.pInverse(g, p)) % p
        return (3 * (buf1 * buf2)) % p




    @staticmethod
    def power(base: int, exponent: int, p: int) -> int:
        result = 1
        base = base % p

        while exponent > 0:
            if exponent % 2 == 1:
                result = (result * base) % p
            base = (base * base) % p
            exponent //= 2

        return result



    @staticmethod
    def pExp(a: int, b: int, p: int) -> int:
        result = 1
        a = a % p
        while b > 0:
            if b % 2 == 1:
                result = (result * a) % p
            b >>= 1
            a = (a * a) % p
        return result

    @staticmethod
    def pInverse(a: int, p: int) -> int:
        return Polynomial.pExp(a, p - 2, p)

    @staticmethod
    def generate_random_number(H: List[int], mod: int) -> int:
        while True:
            random_number = random.randint(0, mod - 1)
            if random_number not in H:
                return random_number

    @staticmethod
    def add_polynomials(poly1: List[int], poly2: List[int], p: int) -> List[int]:
        max_size = max(len(poly1), len(poly2))
        result = [0] * max_size

        for i in range(max_size):
            if i < len(poly1):
                result[i] = (result[i] + poly1[i]) % p
            if i < len(poly2):
                result[i] = (result[i] + poly2[i]) % p
            if result[i] < 0:
                result[i] += p

        return result

    @staticmethod
    def subtract_polynomials(poly1: List[int], poly2: List[int], p: int) -> List[int]:
        max_size = max(len(poly1), len(poly2))
        result = [0] * max_size

        for i in range(max_size):
            val1 = poly1[i] if i < len(poly1) else 0
            val2 = poly2[i] if i < len(poly2) else 0

            result[i] = (val1 - val2) % p
            if result[i] < 0:
                result[i] += p

        return result

    @staticmethod
    def multiply_polynomials(poly1: List[int], poly2: List[int], p: int) -> List[int]:
        result = [0] * (len(poly1) + len(poly2) - 1)

        for i in range(len(poly1)):
            for j in range(len(poly2)):
                result[i + j] = (result[i + j] + poly1[i] * poly2[j]) % p
                if result[i + j] < 0:
                    result[i + j] += p

        return result

    @staticmethod
    def multiply_polynomials(poly1: List[int], poly2: List[int], p: int) -> List[int]:
        result = [0] * (len(poly1) + len(poly2) - 1)

        for i in range(len(poly1)):
            for j in range(len(poly2)):
                result[i + j] = (result[i + j] + poly1[i] * poly2[j]) % p
                if result[i + j] < 0:
                    result[i + j] += p

        return result

    @staticmethod
    def divide_polynomials(dividend: List[int], divisor: List[int], p: int) -> Tuple[List[int], List[int]]:
        quotient = [0] * len(dividend)
        remainder = dividend[:]

        if len(divisor) > len(dividend):
            return [0], remainder

        while len(remainder) >= len(divisor):
            degree_diff = len(remainder) - len(divisor)
            coef = (remainder[-1] * Polynomial.pInverse(divisor[-1], p)) % p
            quotient[degree_diff] = coef

            term = [0] * (degree_diff + 1)
            term[degree_diff] = coef

            term_times_divisor = Polynomial.multiply_polynomials(term, divisor, p)
            term_times_divisor += [0] * (len(remainder) - len(term_times_divisor))

            remainder = Polynomial.subtract_polynomials(remainder, term_times_divisor, p)
            while remainder and remainder[-1] == 0:
                remainder.pop()

        while quotient and quotient[-1] == 0:
            quotient.pop()

        return quotient, remainder

    @staticmethod
    def evaluate_polynomial(polynomial: List[int], x: int, p: int) -> int:
        result = 0
        for i, coef in enumerate(polynomial):
            term_value = coef * Polynomial.power(x, i, p) % p
            if term_value < 0:
                term_value += p
            result += term_value
            result %= p
        return result

    @staticmethod
    def sum_of_evaluations(poly: List[int], points: List[int], p: int) -> int:
        total_sum = 0
        for point in points:
            total_sum = (total_sum + Polynomial.evaluate_polynomial(poly, point, p)) % p
        if total_sum < 0:
            total_sum += p
        return total_sum

    @staticmethod
    def create_mapping(K: List[int], H: List[int], nonZero: List[List[int]]) -> List[List[int]]:
        row = [[], []]
        for i in range(len(nonZero[0])):
            row[0].append(K[i])
            row[1].append(H[nonZero[0][i]])
        for i in range(len(nonZero[0]), len(K)):
            row[0].append(K[i])
            row[1].append(H[i % len(H)])
        return row

    @staticmethod
    def print_polynomial(coefficients: List[int], name: str) -> None:
        result = f"{name} = "
        first = True
        for i in reversed(range(len(coefficients))):
            if coefficients[i] == 0:
                continue
            if not first:
                result += " + " if coefficients[i] > 0 else " - "
            else:
                first = False
            result += f"{abs(coefficients[i])}x^{i}"
        print(result)
   
    @staticmethod
    def create_linear_polynomial(root: int) -> List[int]:
        return [-root, 1]  # Represents (x - root)


    @staticmethod
    def calculate_polynomial_r_alpha_x(alpha: int, n: int, p: int) -> List[int]:
        P = [0] * n  # Initialize a list with n elements, all set to 0

        # Calculate each term of the polynomial P(x)
        current_power_of_alpha = 1  # Represents alpha^0
        for i in range(n):
            P[n - 1 - i] = current_power_of_alpha  # Set P[n-1-i] to alpha^(n-1-i)
            current_power_of_alpha = (current_power_of_alpha * alpha) % p  # Calculate next power of alpha

        return P
    

    @staticmethod
    # Function to compute Lagrange basis polynomial L_i(x)
    def lagrange_polynomial(i, x_values, p) -> List[int]:
        n = len(x_values)
        result = [1]  # Start with 1 for the polynomial (constant term)

        for j in range(n):
            if j != i:
                term = [(p - x_values[j]) % p, 1]  # (x - x_j)
                denominator = (x_values[i] + p - x_values[j]) % p

                # Efficient calculation of the modular inverse
                inv_denominator = Polynomial.pInverse(denominator, p)

                # Multiply the result by (x - x_j) / (x_i - x_j)
                temp = Polynomial.multiply_polynomials(result, term, p)
                temp = [(coef * inv_denominator) % p for coef in temp]
                result = temp

        return result


    @staticmethod
    def setup_lagrange_polynomial(x_values: List[int], y_values: List[int], p: int, name: str) -> List[int]:
        # Automatically detect the number of points
        num_points = len(x_values)

        # Start with a zero polynomial
        polynomial = [0]

        for i in range(num_points):
            if y_values[i] != 0:  # Only process non-zero y-values
                Li = Polynomial.lagrange_polynomial(i, x_values, p)
                Polynomial.print_polynomial(Li, f"L{i + 1}")

                # Multiply the L_i(x) by y_i and add to the final polynomial
                for j in range(len(Li)):
                    if j >= len(polynomial):
                        polynomial.append(0)  # Ensure polynomial is large enough to accommodate all terms
                    polynomial[j] = (polynomial[j] + y_values[i] * Li[j]) % p

        # Print the final polynomial
        Polynomial.print_polynomial(polynomial, name)
        return polynomial
    


    @staticmethod
    def expand_polynomials(roots: List[int], p: int) -> List[int]:
        # Start with the polynomial "1"
        result = [1]

        for root in roots:
            # Multiply the current result polynomial by (x - root)
            temp = [0] * (len(result) + 1)
            for i in range(len(result)):
                temp[i] = (temp[i] + result[i]) % p  # x^n term
                temp[i + 1] = (temp[i + 1] - result[i] * root) % p  # -root * x^(n-1) term
                if temp[i + 1] < 0:
                    temp[i + 1] += p
            result = temp

        result.reverse()
        return result
    
    @staticmethod
    def multiply_polynomial_by_number(H: List[int], h: int, p: int) -> List[int]:
        result = [0] * len(H)

        for i in range(len(H)):
            result[i] = (H[i] * h) % p
            if result[i] < 0:
                result[i] += p

        return result