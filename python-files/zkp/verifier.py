import json
from polynomial import Polynomial  # Assuming a Polynomial module similar to C++ is available
from typing import Any, Dict, List, Union
import random
#import sympy as sp
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
import traceback

app = FastAPI()

JSONType = Union[Dict[str, Any], List[Any], str, int, float, bool, None]

class InputData(BaseModel):
    input: JSONType

@app.post("/process")
async def process(data: InputData):
    try:
        proof_data = data.input
        print("proof_data")
        print(proof_data)
        result = verifier(proof_data)
        return {"output": result}
    except Exception as e:
        print(f"Error: {e}")
        print(traceback.format_exc())  # Log the full traceback
        raise HTTPException(status_code=500, detail=str(e))



# MongoDB connection setup
MONGO_URI = "mongodb://localhost:27017/"  # Replace with your MongoDB URI
DATABASE_NAME = "smartcontract_db"
COLLECTION_NAME = "commitment_smartcontract"

def get_commitment_from_db(commitment_id):
    # Establish MongoDB connection
    client = MongoClient(MONGO_URI)
    db = client[DATABASE_NAME]
    collection = db[COLLECTION_NAME]
    
    # Query the collection for the specified commitment_id
    document = collection.find_one({"commitmentID": commitment_id})
    if not document:
        raise ValueError(f"No document found with commitment_id: {commitment_id}")
    
    # Retrieve the commitmentData field
    commitmentData = document.get("commitmentData")
    if not commitmentData:
        raise ValueError(f"'commitmentData' not found for commitment_id: {commitment_id}")
    
    return commitmentData




def verifier(proof_data: JSONType) -> bool:
    verify = False


    mappings = [
    {"class": 1, "vk": 2023},
    {"class": 2, "vk": 1309},
    {"class": 3, "vk": 2023},
    {"class": 4, "vk": 595},
    {"class": 5, "vk": 833},
    {"class": 6, "vk": 2499},
    {"class": 7, "vk": 357},
    {"class": 8, "vk": 1309},
    {"class": 9, "vk": 1785},
    {"class": 10, "vk": 1785},
    {"class": 11, "vk": 1547},
    {"class": 12, "vk": 357},
    {"class": 13, "vk": 2023},
    {"class": 14, "vk": 357},
    {"class": 15, "vk": 357},
    {"class": 16, "vk": 357}
    ]




    # Read proof
   # with open("ZKP-NEW/final_proof.json", "r") as proof_file:
    #    proof_data = json.load(proof_file)
    sigma1 = proof_data.get("P1AHP", proof_data.get("P_AHP1"))
    w_hat_x = proof_data.get("P2AHP", proof_data.get("P_AHP2"))
    z_hatA = proof_data.get("P3AHP", proof_data.get("P_AHP3"))
    z_hatB = proof_data.get("P4AHP", proof_data.get("P_AHP4"))
    z_hatC = proof_data.get("P5AHP", proof_data.get("P_AHP5"))
    h_0_x = proof_data.get("P6AHP", proof_data.get("P_AHP6"))
    s_x = proof_data.get("P7AHP", proof_data.get("P_AHP7"))
    g_1_x = proof_data.get("P8AHP", proof_data.get("P_AHP8"))
    h_1_x = proof_data.get("P9AHP", proof_data.get("P_AHP9"))
    sigma2 = proof_data.get("P10AHP", proof_data.get("P_AHP10"))
    g_2_x = proof_data.get("P11AHP", proof_data.get("P_AHP11"))
    h_2_x = proof_data.get("P12AHP", proof_data.get("P_AHP12"))
    sigma3 = proof_data.get("P13AHP", proof_data.get("P_AHP13"))
    g_3_x = proof_data.get("P14AHP", proof_data.get("P_AHP14"))
    h_3_x = proof_data.get("P15AHP", proof_data.get("P_AHP15"))
    y_prime = proof_data.get("P16AHP", proof_data.get("P_AHP16"))
    p_17_AHP = proof_data.get("P17AHP", proof_data.get("P_AHP17"))

    Com1_AHP_x = proof_data.get("Com1_AHP_x", proof_data.get("Com_AHP1_x"))   #   Added by Moka
    
    Com2_AHP_x = proof_data.get("Com2_AHP_x", proof_data.get("Com_AHP2_x"))
    Com3_AHP_x = proof_data.get("Com3_AHP_x", proof_data.get("Com_AHP3_x"))
    Com4_AHP_x = proof_data.get("Com4_AHP_x", proof_data.get("Com_AHP4_x"))
    Com5_AHP_x = proof_data.get("Com5_AHP_x", proof_data.get("Com_AHP5_x"))
    Com6_AHP_x = proof_data.get("Com6_AHP_x", proof_data.get("Com_AHP6_x"))
    Com7_AHP_x = proof_data.get("Com7_AHP_x", proof_data.get("Com_AHP7_x"))
    Com8_AHP_x = proof_data.get("Com8_AHP_x", proof_data.get("Com_AHP8_x"))
    Com9_AHP_x = proof_data.get("Com9_AHP_x", proof_data.get("Com_AHP9_x"))
    Com10_AHP_x = proof_data.get("Com10_AHP_x", proof_data.get("Com_AHP10_x"))
    Com11_AHP_x = proof_data.get("Com11_AHP_x", proof_data.get("Com_AHP11_x"))
    Com12_AHP_x = proof_data.get("Com12_AHP_x", proof_data.get("Com_AHP12_x"))
    Com13_AHP_x = proof_data.get("Com13_AHP_x", proof_data.get("Com_AHP13_x"))
    commitment_id_proof = proof_data["commitment_id"]


   
    # Replace this with the input commitment_id
    try:
        # Fetch commitment data from MongoDB
        commitment_data = get_commitment_from_db(commitment_id_proof)
        commitment_data = json.loads(commitment_data)
        
        print("Type of commitment_data:", type(commitment_data))

        print("Commitment data retrieved successfully:", commitment_data)
        
        print("rowA_x:", commitment_data["RowA"])
    except Exception as e:
        print(f"Error fetching commitment: {e}")
    
   


    # Read commitment
    # with open("program_commitment.json", "r") as commitment_file:
    # commitment_data = json.load(commitment_file)

    rowA_x = commitment_data.get("RowA", commitment_data.get("row_AHP_A"))
    colA_x = commitment_data.get("ColA", commitment_data.get("col_AHP_A"))
    valA_x = commitment_data.get("ValA", commitment_data.get("val_AHP_A"))
    rowB_x = commitment_data.get("RowB", commitment_data.get("row_AHP_B"))
    colB_x = commitment_data.get("ColB", commitment_data.get("col_AHP_B"))
    valB_x = commitment_data.get("ValB", commitment_data.get("val_AHP_B"))
    rowC_x = commitment_data.get("RowC", commitment_data.get("row_AHP_C"))
    colC_x = commitment_data.get("ColC", commitment_data.get("col_AHP_C"))
    valC_x = commitment_data.get("ValC", commitment_data.get("val_AHP_C"))
    Class = commitment_data["class"] 


    vk = Polynomial.get_vk(Class, mappings)



    # Read class
    # Read class configuration from class-N.json
    with open("class.json", "r") as class_file:
         class_data = json.load(class_file)
         # n_i, n_g, m, n, p, g = 1, 3, 9, 5, 181, 2
        # Assume `Class` is passed as a parameter to identify the required configuration
    if str(Class) in class_data:  # Convert `Class` to string as JSON keys are strings
         class_config = class_data[str(Class)]
         n_i, n_g, m, n, p, g = (
         class_config["n_i"],
         class_config["n_g"],
         class_config["m"],
         class_config["n"],
         class_config["p"],
         class_config["g"],
        )
    else:
       raise ValueError(f"Class {Class} not found in class-N.json")


    x_prime = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 22, p), p)

    alpha = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 0, p), p)
    etaA = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 1, p), p)
    etaB = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 2, p), p)
    etaC = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 3, p), p)

    beta1 = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 8, p), p)
    beta2 = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 9, p), p)
    beta3 = Polynomial.generate_random_number([0], p)

    eta_w_hat = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 10, p), p)
    eta_z_hatA = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 11, p), p)
    eta_z_hatB = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 12, p), p)
    eta_z_hatC = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 13, p), p)
    eta_h_0_x = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 14, p), p)
    eta_s_x = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 15, p), p)
    eta_g_1_x = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 16, p), p)
    eta_h_1_x = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 17, p), p)
    eta_g_2_x = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 18, p), p)
    eta_h_2_x = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 19, p), p)
    eta_g_3_x = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 20, p), p)
    eta_h_3_x = Polynomial.hash_and_extract_lower_4_bytes(Polynomial.evaluate_polynomial(s_x, 21, p), p)



    print("n:", n)
    print("m:", m)
    print("g:", g)

    K = [1]
    g_m = ((p - 1) * Polynomial.pInverse(m, p)) % p
    y = Polynomial.power(g, g_m, p)
    for i in range(1, m):
        K.append(Polynomial.power(y, i, p))

    H = [1]
    g_n = ((p - 1) // n) % p
    w = Polynomial.power(g, g_n, p)
    for i in range(1, n):
        H.append(Polynomial.power(w, i, p))

    vH_x = [(-1) % p] + [0] * (n - 1) + [1]
    Polynomial.print_polynomial(vH_x, "vH(x)")

    vK_x = Polynomial.create_linear_polynomial(K[0])
    for k in K[1:]:
        next_poly = Polynomial.create_linear_polynomial(k)
        vK_x = Polynomial.multiply_polynomials(vK_x, next_poly, p)
    Polynomial.print_polynomial(vK_x, "vK(x)")

    vH_beta1 = Polynomial.evaluate_polynomial(vH_x, beta1, p)
    print("vH(beta1) =", vH_beta1)

    vH_beta2 = Polynomial.evaluate_polynomial(vH_x, beta2, p)
    print("vH(beta2) =", vH_beta2)

    poly_pi_a = Polynomial.multiply_polynomials(
        Polynomial.subtract_polynomials(rowA_x, [beta2], p),
        Polynomial.subtract_polynomials(colA_x, [beta1], p),
        p
    )
    poly_pi_b = Polynomial.multiply_polynomials(
        Polynomial.subtract_polynomials(rowB_x, [beta2], p),
        Polynomial.subtract_polynomials(colB_x, [beta1], p),
        p
    )
    poly_pi_c = Polynomial.multiply_polynomials(
        Polynomial.subtract_polynomials(rowC_x, [beta2], p),
        Polynomial.subtract_polynomials(colC_x, [beta1], p),
        p
    )
    Polynomial.print_polynomial(poly_pi_a, "poly_pi_a(x)")
    Polynomial.print_polynomial(poly_pi_b, "poly_pi_b(x)")
    Polynomial.print_polynomial(poly_pi_c, "poly_pi_c(x)")

    poly_etaA_vH_B2_vH_B1 = [(etaA * vH_beta2 * vH_beta1) % p]
    poly_etaB_vH_B2_vH_B1 = [(etaB * vH_beta2 * vH_beta1) % p]
    poly_etaC_vH_B2_vH_B1 = [(etaC * vH_beta2 * vH_beta1) % p]

    poly_sig_a = Polynomial.multiply_polynomials(poly_etaA_vH_B2_vH_B1, valA_x, p)
    poly_sig_b = Polynomial.multiply_polynomials(poly_etaB_vH_B2_vH_B1, valB_x, p)
    poly_sig_c = Polynomial.multiply_polynomials(poly_etaC_vH_B2_vH_B1, valC_x, p)
    Polynomial.print_polynomial(poly_sig_a, "poly_sig_a(x)")
    Polynomial.print_polynomial(poly_sig_b, "poly_sig_b(x)")
    Polynomial.print_polynomial(poly_sig_c, "poly_sig_c(x)")





    a_x = Polynomial.add_polynomials(
        Polynomial.add_polynomials(
            Polynomial.multiply_polynomials(poly_sig_a, Polynomial.multiply_polynomials(poly_pi_b, poly_pi_c, p), p),
            Polynomial.multiply_polynomials(poly_sig_b, Polynomial.multiply_polynomials(poly_pi_a, poly_pi_c, p), p),
            p
        ),
        Polynomial.multiply_polynomials(poly_sig_c, Polynomial.multiply_polynomials(poly_pi_a, poly_pi_b, p), p),
        p
    )

    b_x = Polynomial.multiply_polynomials(
        Polynomial.multiply_polynomials(poly_pi_a, poly_pi_b, p),
        poly_pi_c,
        p
    )

    r_alpha_x = Polynomial.calculate_polynomial_r_alpha_x(alpha, n, p)
    etaA_z_hatA_x = Polynomial.multiply_polynomial_by_number(z_hatA, etaA, p)
    etaB_z_hatB_x = Polynomial.multiply_polynomial_by_number(z_hatB, etaB, p)
    etaC_z_hatC_x = Polynomial.multiply_polynomial_by_number(z_hatC, etaC, p)
    Sum_M_eta_M_z_hat_M_x = Polynomial.add_polynomials(
        Polynomial.add_polynomials(etaA_z_hatA_x, etaB_z_hatB_x, p),
        etaC_z_hatC_x, p
    )

    t = n_i + 1
    


   #   Edited by Moka
    zero_to_t_for_z = [1]
    for i in range(32):
        zero_to_t_for_z.append(Com1_AHP_x[i])

    zero_to_t_for_H = H[:t]




    polyX_HAT_H = Polynomial.setup_lagrange_polynomial(zero_to_t_for_H, zero_to_t_for_z, p, "x_hat(h)")


    r_Sum_x = Polynomial.multiply_polynomials(r_alpha_x, Sum_M_eta_M_z_hat_M_x, p)
    v_H = Polynomial.expand_polynomials(zero_to_t_for_H, p)
    z_hat_x = Polynomial.add_polynomials(
        Polynomial.multiply_polynomials(w_hat_x, v_H, p),
        polyX_HAT_H,
        p
    )


    # Compute ComP_AHP_x
    ComP_AHP_x = (
          (Com2_AHP_x * eta_w_hat) % p +
          (Com3_AHP_x * eta_z_hatA) % p +
          (Com4_AHP_x * eta_z_hatB) % p +
          (Com5_AHP_x * eta_z_hatC) % p +
          (Com6_AHP_x * eta_h_0_x) % p +
          (Com7_AHP_x * eta_s_x) % p +
          (Com8_AHP_x * eta_g_1_x) % p +
          (Com9_AHP_x * eta_h_1_x) % p +
          (Com10_AHP_x * eta_g_2_x) % p +
          (Com11_AHP_x * eta_h_2_x) % p +
          (Com12_AHP_x * eta_g_3_x) % p +
          (Com13_AHP_x * eta_h_3_x) % p
          ) % p

    # Print the result
    print(f"ComP_AHP_x = {ComP_AHP_x}")

    # Print the polynomials and values
    Polynomial.print_polynomial(a_x, "a_x")
    Polynomial.print_polynomial(b_x, "b_x")
    Polynomial.print_polynomial(g_3_x, "g_3_x")
    print(f"beta3 = {beta3}")
    print(f"sigma3 = {sigma3}")



    p_x = Polynomial.add_polynomials(
        Polynomial.add_polynomials(
            Polynomial.add_polynomials(
                Polynomial.multiply_polynomial_by_number(w_hat_x, eta_w_hat, p),
                Polynomial.multiply_polynomial_by_number(z_hatA, eta_z_hatA, p),
                p
            ),
            Polynomial.multiply_polynomial_by_number(z_hatB, eta_z_hatB, p),
            p
        ),
        Polynomial.multiply_polynomial_by_number(z_hatC, eta_z_hatC, p),
        p
    )
    

    eq11 = (Polynomial.evaluate_polynomial(h_3_x, beta3, p) * Polynomial.evaluate_polynomial(vK_x, beta3, p)) % p
    print("eq11:", eq11)
    eq12 = (Polynomial.evaluate_polynomial(a_x, beta3, p) - ((Polynomial.evaluate_polynomial(b_x, beta3, p) * (beta3 * Polynomial.evaluate_polynomial(g_3_x, beta3, p) + (sigma3 * Polynomial.pInverse(m, p)) % p)))) % p
    eq12 %= p
    if eq12 < 0:
        eq12 += p

    eq21 = (Polynomial.evaluate_polynomial(r_alpha_x, beta2, p) * sigma3) % p
    eq22 = ((Polynomial.evaluate_polynomial(h_2_x, beta2, p) * Polynomial.evaluate_polynomial(vH_x, beta2, p)) % p + (beta2 * Polynomial.evaluate_polynomial(g_2_x, beta2, p)) % p + (sigma2 * Polynomial.pInverse(n, p)) % p) % p
    eq12 %= p
    if eq12 < 0: 
        eq12 += p
  

    eq31 = (Polynomial.evaluate_polynomial(s_x, beta1, p) + Polynomial.evaluate_polynomial(r_alpha_x, beta1, p) * Polynomial.evaluate_polynomial(Sum_M_eta_M_z_hat_M_x, beta1, p) - sigma2 * Polynomial.evaluate_polynomial(z_hat_x, beta1, p))
    eq32 = (Polynomial.evaluate_polynomial(h_1_x, beta1, p) * Polynomial.evaluate_polynomial(vH_x, beta1, p) + beta1 * Polynomial.evaluate_polynomial(g_1_x, beta1, p) + sigma1 * Polynomial.pInverse(n, p)) % p
    eq31 %= p
    if eq31 < 0:
        eq31 += p
  
    eq41 = (Polynomial.evaluate_polynomial(z_hatA, beta1, p) * Polynomial.evaluate_polynomial(z_hatB, beta1, p) - Polynomial.evaluate_polynomial(z_hatC, beta1, p))
    eq42 = (Polynomial.evaluate_polynomial(h_0_x, beta1, p) * Polynomial.evaluate_polynomial(vH_x, beta1, p)) % p
    eq41 %= p
    if eq41 < 0:
        eq41 += p
  
    # Compute eq51
    eq51Buf = (ComP_AHP_x - (g * y_prime)) % p
    if eq51Buf < 0:
        eq51Buf += p
    eq51 = Polynomial.e_func(eq51Buf, g, g, p)

    # Compute eq52
    eq52BufP2 = (vk - (g * x_prime)) % p
    if eq52BufP2 < 0:
        eq52BufP2 += p
    eq52 = Polynomial.e_func(p_17_AHP, eq52BufP2, g, p)



    print("eq12:", eq12)
    print("eq21:", eq21)
    print("eq22:", eq22)
    print("eq31:", eq31)
    print("eq32:", eq32)
    print("eq41:", eq41)
    print("eq42:", eq42)
    print("eq51:", eq51)
    print("eq52:", eq52)



    def check_equation(lhs, rhs, p):
        lhs %= p
        rhs %= p
        lhs = lhs + p if lhs < 0 else lhs
        rhs = rhs + p if rhs < 0 else rhs
        return lhs == rhs

    eq11_check = check_equation(eq11, eq12, p)
    eq21_check = check_equation(eq21, eq22, p)
    eq31_check = check_equation(eq31, eq32, p)
    # eq41_check = check_equation(eq41, eq42, p)

    eq51_check = check_equation(eq51, eq52, p)

    
    
    # if eq11_check and eq21_check and eq31_check and eq41_check and eq51_check:
    if eq11_check and eq21_check and eq31_check and eq51_check:

        verify = True

    return verify