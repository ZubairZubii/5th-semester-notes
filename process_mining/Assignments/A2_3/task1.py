import random

class EventLogGenerator:
    def __init__(self, process_description, num_traces=10, noise_level=1, uncommon_path_freq=0.05, missing_event_chance=0.05):
        """
        Initialize the event log generator with the process parameters.
        
        :param process_description: List of lists, where each sublist represents a valid path of ordered tasks.
        :param num_traces: Number of traces to generate in the log.
        :param noise_level: Probability of adding a random noise event.
        :param uncommon_path_freq: Probability of following an uncommon path.
        :param missing_event_chance: Probability of missing an event in a trace.
        """
        self.process_description = process_description
        self.num_traces = num_traces
        self.noise_level = noise_level
        self.uncommon_path_freq = uncommon_path_freq
        self.missing_event_chance = missing_event_chance
        self.noise_events = ["X", "Y", "Z"]  # Arbitrary noise events

    def generate_trace(self):
        """
        Generate a single trace based on the process description, with optional noise and missing events.
        """
        # Choose a path from the process description, with a chance for uncommon paths
        path = random.choices(self.process_description, weights=[1 - self.uncommon_path_freq] * (len(self.process_description) - 1) + [self.uncommon_path_freq])[0]
        
        trace = []
        for event in path:
            # Occasionally skip an event to simulate missing data
            if random.random() > self.missing_event_chance:
                trace.append(event)
        
        # Insert random noise events at random positions
        if random.random() < self.noise_level:
            noise_event = random.choice(self.noise_events)
            insert_pos = random.randint(0, len(trace))
            trace.insert(insert_pos, noise_event)
        
        return trace

    def generate_event_log(self):
        """
        Generate the entire event log with the specified number of traces.
        """
        event_log = [self.generate_trace() for _ in range(self.num_traces)]
        return event_log

    def save_event_log(self, filename="event_log.txt"):
        """
        Save the generated event log to a file.
        
        :param filename: The name of the file to save the log.
        """
        event_log = self.generate_event_log()
        with open(filename, "w") as f:
            for trace in event_log:
                f.write(",".join(trace) + "\n")
        print(f"Event log saved to {filename}")

# Example usage:
if __name__ == "__main__":
    # Define a sample process description with possible paths
    process_description = [
        ["A", "B", "C", "D", "E"],          # Main path
        ["A", "C", "B", "D", "E"],          # Alternate path with concurrency (uncommon)
        ["A", "B", "D", "E"]                # Shorter path (less common)
    ]
    
    # Initialize the generator
    generator = EventLogGenerator(
        process_description=process_description,
        num_traces=10,               # Number of traces to generate
        noise_level=0.1,              # 10% chance of adding random noise
        uncommon_path_freq=0.1,       # 10% chance of uncommon paths
        missing_event_chance=0.05     # 5% chance to skip an event
    )
    
    # Generate and save the event log
    generator.save_event_log("event_log.txt")
