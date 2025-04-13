from collections import defaultdict

def read_event_log(filename):
    with open(filename, "r") as f:
        return [line.strip().split(",") for line in f.readlines()]

def alpha_algorithm(event_log):
    # Step 1: Extract T_L, T_I, and T_O
    T_L = set(event for trace in event_log for event in trace)
    T_I = set(trace[0] for trace in event_log)
    T_O = set(trace[-1] for trace in event_log)

    # Step 2: Direct causality relation (->_L)
    direct_causality = defaultdict(set)
    for trace in event_log:
        for i in range(len(trace) - 1):
            direct_causality[trace[i]].add(trace[i + 1])

    # Step 3: Causality and independence (#_L)
    def is_causal(a, b):
        return b in direct_causality[a]

    def is_independent(a, b):
        return not is_causal(a, b) and not is_causal(b, a)

    # Step 4: XL construction
    XL = set()
    for A in T_L:
        for B in T_L:
            if A != B and is_causal(A, B):
                XL.add((frozenset([A]), frozenset([B])))

    # Step 5: Maximal sets (YL)
    YL = set()
    for (A, B) in XL:
        if not any((A < A_prime and B <= B_prime) or (A <= A_prime and B < B_prime)
                   for (A_prime, B_prime) in XL):
            YL.add((A, B))

    # Step 6: Places (P_L) and Flow (F_L)
    PL = {f"P({','.join(A)}->{','.join(B)})" for A, B in YL} | {"iL", "oL"}
    FL = set()
    
    # Add flow from iL to initial events
    FL.update(("iL", t) for t in T_I)
    
    # Add flow between YL places and events
    for A, B in YL:
        for a in A:
            FL.add((a, f"P({','.join(A)}->{','.join(B)})"))
        for b in B:
            FL.add((f"P({','.join(A)}->{','.join(B)})", b))
    
    # Add flow from final events to oL
    FL.update((t, "oL") for t in T_O)

    return {
        "Places": PL,
        "Transitions": T_L,
        "Flow": FL
    }

def save_alpha_result(filename, alpha_result):
    with open(filename, "w") as f:
        f.write("Places (P_L):\n")
        for place in alpha_result["Places"]:
            f.write(f"{place}\n")
        f.write("\nTransitions (T_L):\n")
        for transition in alpha_result["Transitions"]:
            f.write(f"{transition}\n")
        f.write("\nFlow (F_L):\n")
        for flow in alpha_result["Flow"]:
            f.write(f"{flow[0]} -> {flow[1]}\n")

# Example usage
if __name__ == "__main__":
    # Load the event log
    event_log = read_event_log("event_log.txt")

    # Apply the Alpha Algorithm
    alpha_result = alpha_algorithm(event_log)

    # Display results in the console
    print("Places (P_L):", alpha_result["Places"])
    print("Transitions (T_L):", alpha_result["Transitions"])
    print("Flow (F_L):", alpha_result["Flow"])

    # Save results to a text file
    save_alpha_result("alpha_result.txt", alpha_result)
    print("Alpha algorithm results saved to 'alpha_result.txt'.")
