import networkx as nx
import matplotlib.pyplot as plt


def visualize_petri_net(places, transitions, flow):
    """
    Visualize a Petri net clearly depicting transitions, places, and arcs to show the discovered process model.
    """
    # Create a directed graph
    G = nx.DiGraph()

    # Add nodes (places and transitions) with distinct attributes
    for place in places:
        G.add_node(place, type="place", shape="circle")

    for transition in transitions:
        G.add_node(transition, type="transition", shape="rectangle")

    # Add flow edges with clear directionality
    G.add_edges_from(flow)

    # Define positions for nodes with increased spacing for clarity
    pos = nx.spring_layout(G, seed=42, k=3.0)  # Increased k for even more spacing

    # Start plotting
    plt.figure(figsize=(15, 12))  # Increase figure size for more space

    # Draw places as circles
    nx.draw_networkx_nodes(
        G,
        pos,
        nodelist=[node for node, attr in G.nodes(data=True) if attr["type"] == "place"],
        node_shape="o",
        node_size=2000,  # Larger size for places
        node_color="skyblue",
        edgecolors="black",
    )

    # Draw transitions as rectangles
    nx.draw_networkx_nodes(
        G,
        pos,
        nodelist=[node for node, attr in G.nodes(data=True) if attr["type"] == "transition"],
        node_shape="s",
        node_size=1500,  # Larger size for transitions
        node_color="limegreen",
        edgecolors="black",
    )

    # Draw edges with arrows to indicate flow direction
    nx.draw_networkx_edges(
        G,
        pos,
        arrowstyle="-|>",
        arrowsize=30,  # Larger arrow size for better visibility
        edge_color="black",
        width=2,
        alpha=0.5  # Slightly transparent edges to make the diagram clearer
    )

    # Add small labels for nodes with slight offset to avoid overlap
    nx.draw_networkx_labels(G, pos, font_size=10, font_color="black", verticalalignment="center", horizontalalignment="center")

    # Add labels between places (customized position for clarity)
    for place in places:
        # Adding the place label in the center of the place node
        x, y = pos[place]
        plt.text(x, y, place, fontsize=10, color='black', ha='center', va='center')

    # Add a title and clean up axes
    plt.title("Petri Net Visualization", fontsize=18)
    plt.axis("off")
    plt.show()


def read_alpha_result(file_path):
    """
    Read the alpha result file and extract places, transitions, and flow.
    """
    places = set()
    transitions = set()
    flow = set()

    section = None

    with open(file_path, "r") as file:
        for line in file:
            line = line.strip()
            if not line:  # Skip empty lines
                continue

            if line.startswith("Places"):
                section = "places"
                continue
            elif line.startswith("Transitions"):
                section = "transitions"
                continue
            elif line.startswith("Flow"):
                section = "flow"
                continue

            if section == "places":
                if line.startswith("P(") or line == "oL" or line == "iL":
                    places.add(line)
            elif section == "transitions":
                transitions.add(line)
            elif section == "flow":
                # Convert flow relations into tuples
                source, target = line.split(" -> ")
                flow.add((source, target))

    return places, transitions, flow


def evaluate_fitness(model_places, model_transitions, model_flow, test_traces):
    """
    Evaluate the fitness of the model based on how well it can replay the test traces.
    """
    fitness_scores = []
    
    for trace in test_traces:
        # Simulate replay of the trace through the Petri net (simplified replay model)
        current_state = set(model_places)  # Assume the initial state includes all places
        for event in trace:
            if event in model_transitions:
                # If transition is available in the Petri net, "fire" it (simplified simulation)
                current_state = {p for p in model_places if (p, event) in model_flow}
            else:
                # If event doesn't match a valid transition, it indicates a mismatch in fitness
                fitness_scores.append(0)
                break
        else:
            fitness_scores.append(1)  # Trace completely fit
    
    return sum(fitness_scores) / len(fitness_scores)


def evaluate_precision(model_places, model_transitions, model_flow, test_traces):
    """
    Evaluate the precision of the model by checking whether it predicts unseen behavior.
    """
    predicted_behavior = set()

    for trace in test_traces:
        current_state = set(model_places)
        for event in trace:
            if event in model_transitions:
                # Predict next behavior based on current state
                predicted_behavior.add(event)
            else:
                break

    # Compare the predicted behavior with the original model flow
    total_possible_behavior = set(model_flow)
    incorrect_behavior = predicted_behavior - total_possible_behavior
    precision_score = 1 - (len(incorrect_behavior) / len(predicted_behavior)) if predicted_behavior else 1
    
    return precision_score


# Example usage
if __name__ == "__main__":
    # File path for the alpha result file
    file_path = "alpha_result.txt"

    # Read places, transitions, and flow from the file
    places, transitions, flow = read_alpha_result(file_path)

    test_traces = [
    ['iL', 'B', 'P(B->C)', 'C', 'P(C->E)', 'E'],  # Example trace 1
    ['iL', 'Y', 'P(Y->A)', 'A', 'P(A->B)', 'B', 'P(B->D)', 'D'],  # Example trace 2
    ['iL', 'Z', 'P(Z->A)', 'A', 'P(A->C)', 'C', 'P(C->B)', 'B'],  # Example trace 3
    ['iL', 'C', 'P(C->Y)', 'Y', 'P(Y->A)', 'A', 'P(A->D)', 'D'],  # Example trace 4
    ['iL', 'A', 'P(A->B)', 'B', 'P(B->E)', 'E', 'P(E->oL)', 'oL'],  # Example trace 5
    ['iL', 'Z', 'P(Z->E)', 'E', 'P(E->oL)', 'oL'],  # Example trace 6
    ]


    # Evaluate fitness
    fitness = evaluate_fitness(places, transitions, flow, test_traces)
    print(f"Fitness of the model: {fitness:.2f}")

    # Evaluate precision
    precision = evaluate_precision(places, transitions, flow, test_traces)
    print(f"Precision of the model: {precision:.2f}")

    # Visualize the Petri net
    visualize_petri_net(places, transitions, flow)
