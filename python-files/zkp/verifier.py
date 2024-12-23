import json
from polynomial import Polynomial  # Assuming a Polynomial module similar to C++ is available
from typing import Any, Dict, List, Union
import random
#import sympy as sp
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

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
        raise HTTPException(status_code=500, detail=str(e))

def verifier(proof_data: JSONType) -> bool:
    verify = False
   # beta3 = 5  # Must be a random number
   # z_random = 2


   # alpha = 10  # a random number based on s_x
   # beta1 = 22  # beta1 = hashAndExtractLower4Bytes(s_x[8], p)
   # beta2 = 80  # beta2 = hashAndExtractLower4Bytes(s_x[9], p)
   #  etaA, etaB, etaC = 2, 30, 100
   # eta_w_hat, eta_z_hatA, eta_z_hatB, eta_z_hatC = 1, 4, 10, 8
   # eta_h_0_x, eta_s_x, eta_g_1_x, eta_h_1_x = 32, 45, 92, 11
   # eta_g_2_x, eta_h_2_x, eta_g_3_x, eta_h_3_x = 1, 5, 25, 63


    


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



    # Test the function
    print(Polynomial.get_vk(1, mappings))  # Output: 101
    print(Polynomial.get_vk(2, mappings))  # Output: 202


    # Read setup
    # with open("ZKP-NEW/final_setup.json", "r") as setup_file:
    #     setup_data = json.load(setup_file)
    # Class = setup_data["Class"]
    # ck = setup_data["ck"]
    # vk = setup_data["vk"]

    

    # Read commitment
    with open("program_commitment.json", "r") as commitment_file:
        commitment_data = json.load(commitment_file)
    rowA_x = commitment_data["RowA"]
    colA_x = commitment_data["ColA"]
    valA_x = commitment_data["ValA"]
    rowB_x = commitment_data["RowB"]
    colB_x = commitment_data["ColB"]
    valB_x = commitment_data["ValB"]
    rowC_x = commitment_data["RowC"]
    colC_x = commitment_data["ColC"]
    valC_x = commitment_data["ValC"]
    Class = commitment_data["Class"]
    
    vk = Polynomial.get_vk(Class, mappings)

    # Read proof
   # with open("ZKP-NEW/final_proof.json", "r") as proof_file:
    #    proof_data = json.load(proof_file)
    sigma1 = proof_data["P1AHP"]
    w_hat_x = proof_data["P2AHP"]
    z_hatA = proof_data["P3AHP"]
    z_hatB = proof_data["P4AHP"]
    z_hatC = proof_data["P5AHP"]
    h_0_x = proof_data["P6AHP"]
    s_x = proof_data["P7AHP"]
    g_1_x = proof_data["P8AHP"]
    h_1_x = proof_data["P9AHP"]
    sigma2 = proof_data["P10AHP"]
    g_2_x = proof_data["P11AHP"]
    h_2_x = proof_data["P12AHP"]
    sigma3 = proof_data["P13AHP"]
    g_3_x = proof_data["P14AHP"]
    h_3_x = proof_data["P15AHP"]
    y_prime = proof_data["P16AHP"]

    p_17_AHP = proof_data["P17AHP"]

    Com1_AHP_x = proof_data["Com1_AHP_x"]   #   Added by Moka
    Com2_AHP_x = proof_data["Com2_AHP_x"]
    Com3_AHP_x = proof_data["Com3_AHP_x"]
    Com4_AHP_x = proof_data["Com4_AHP_x"]
    Com5_AHP_x = proof_data["Com5_AHP_x"]
    Com6_AHP_x = proof_data["Com6_AHP_x"]
    Com7_AHP_x = proof_data["Com7_AHP_x"]
    Com8_AHP_x = proof_data["Com8_AHP_x"]
    Com9_AHP_x = proof_data["Com9_AHP_x"]
    Com10_AHP_x = proof_data["Com10_AHP_x"]
    Com11_AHP_x = proof_data["Com11_AHP_x"]
    Com12_AHP_x = proof_data["Com12_AHP_x"]
    Com13_AHP_x = proof_data["Com13_AHP_x"]

    #curve = proof_data["curve"]
    #protocol = proof_data["protocol"]



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
    # for i in range(t):
    #     zero_to_t_for_H.append(H[i])


    print("ttttttttttttttttt")

    polyX_HAT_H = Polynomial.setup_lagrange_polynomial(zero_to_t_for_H, zero_to_t_for_z, p, "x_hat(h)")

    print("ffffffffffffffffff")

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
    eq41_check = check_equation(eq41, eq42, p)

    eq51_check = check_equation(eq51, eq52, p)


    if eq11_check and eq21_check and eq31_check and eq41_check and eq51_check:
        verify = True

    return verify


#proof_data = {"commitmentID":"123456789","iot_manufacturer_name":"FidesInnova","iot_device_name":"test","device_hardware_version":"1","firmware_version":"2","Class":2,"P1AHP":4255,"P2AHP":[1020376,2374,464250,1413000,739800,1395163],"P3AHP":[1637651,1143959,1552494,192459,1329299,1585875,1371442,1340964,1274738,668958,570137,912320,654004,143609,75338,900171,1252537,774494,1635491,203342,1320737,1510947,1178490,1204928,862657,316104,610953,842661,1116910,1124399,1492922,1242586,55518,287655,1274645,1307213,1299171,448933,206351],"P4AHP":[858339,145039,1195032,1321199,712726,399806,212248,1279615,1081525,957266,105031,1576365,1487920,1234947,453157,1584983,423072,88555,963602,524764,450575,851220,194532,821095,909980,769999,892446,473297,1583809,1486317,889599,580649,1049305,31805,1226599,944384,140612,184944,123420],"P5AHP":[1204343,550082,303889,186455,1403631,1356088,366152,967276,1137276,81625,659729,1596596,1056056,182271,967991,1264680,1460660,1423258,1357289,1417022,1540879,1428005,1178747,1372430,1104680,587361,661698,935079,1176963,608077,506836,744277,24000,1533781,705635,1500307,1448824,1245688,1355747],"P6AHP":[774673,421488,488831,743713,1220920,730387,78325,723440,312820,12268,6677,457348,1299974,58796,581305,892206,813725,414507,571395,1074078,682437,1606167,1142416,633085,750153,263048,1254675,329007,1234740,830757,185987,565818,863642,1273848,1202358,612811,1375207,113047,937812,997566],"P7AHP":[115,3,0,0,20,1,0,17,101,0,5],"P8AHP":[1300703,1542281,335438,512891,767730,949231,1660118,210656,731389,931440,867545,982691,1088580,581458,1270278,977753,1161065,215999,573762,1017661,872792,921395,686339,1475083,1644632,209794,576867,1013568,1143561,185503,478497,438007,777166,1001638,1578662,125583],"P9AHP":[997686,1108973,246943,144008,1612013,1153190,113690,398961,1501589,936838,1610650,56835,226333,328785,1200531,681574,107493,1106626,451610,1677159,1330999,1426598,1369987,587134,72040,1412021,1083474,1419580,629867,974226,502385,1664574,881602,940255,183899,499478,869807,1322604],"P10AHP":1261110,"P11AHP":[455935,231579,1617134,598613,1584743,776228,459663,1099769,156025,1660844,594114,97753,1353223,326672,1122463,1040680,1517619,493745,293268,921639,890064,658008,1323901,1184461,619653,640570,920747,756537,827316,1581200,1578319,1126949,237010,372445,1507749,1318097],"P12AHP":[1669671,42958,1178281,480749,1362264,682456,418224,703377,158422,477866,1631072,258612,951080,267638,1497485,467736,1019454,719681,1658803,1460491,576527,770945,555912,1186791,1609670,576784,499107,1490750,573845,778046,1644427,1139400,392840,762451,1211966,785813],"P13AHP":1613950,"P14AHP":[1310913,1193977,570600,1516613,102958,150467,1648061],"P15AHP":[680773,1341140,98204,88517,393300,643266,1603209,322965,1413684,835298,361520,1227580,1488945,521975,731554,753992,1004432,16443,1220790,1301638,1086405,840161,1526458,1037651,653620,1559734,1617525,1319167,875151,1233121,929072,1662006,732803,158189,332038,211117,588625,1409637,643627,1598091,801330,61748],"P16AHP":693950,"P17AHP":975158}
#verification_result = verifier(proof_data)
#print("Verification result:", verification_result)
