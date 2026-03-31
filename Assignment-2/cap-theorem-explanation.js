const fs = require("fs");
const path = require("path");

const answer = `Question 2: What does the CAP theorem state, and why can't a distributed system guarantee all three properties?

Answer:
The CAP theorem states that a distributed system can guarantee only two out of the following three properties at the same time:

1. Consistency
- Every read gets the most recent write or an error.

2. Availability
- Every request receives a response, even if that response is not the latest data.

3. Partition Tolerance
- The system continues to work even when communication between network nodes is lost or delayed.

Why all three cannot be guaranteed:
In a distributed system, network failures can happen. This is called a partition.
When a partition happens, the system must choose one of these:

- Consistency: reject some requests until all nodes agree on the latest data.
- Availability: respond to requests even if some nodes do not have the latest data.

So during a partition, the system cannot provide both perfect consistency and full availability together.
Because partitions are unavoidable in distributed systems, a practical distributed database must choose between:

- CP (Consistency + Partition Tolerance)
or
- AP (Availability + Partition Tolerance)

Example:
- MongoDB can be tuned to prefer consistency in many setups.
- Cassandra is often designed to favor availability and partition tolerance.

Conclusion:
CAP theorem means that when a network partition occurs, a distributed system must sacrifice either consistency or availability. That is why all three properties cannot be fully guaranteed at the same time.`;

const outputPath = path.join(__dirname, "cap-theorem-explanation.txt");
fs.writeFileSync(outputPath, answer, "utf8");

console.log(`Answer saved to ${outputPath}`);
