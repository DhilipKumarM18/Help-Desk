export const mockTickets = [
  {
    id: 1,
    title: "Login Issue",
    description: "Cannot login after reset.",
    priority: "HIGH",
    status: "OPEN",
    createdBy: { name: "John Doe" },
    assignedTo: null,
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: 2,
    title: "Dashboard Bug",
    description: "Real-time stats not loading.",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    createdBy: { name: "Alice Smith" },
    assignedTo: { name: "Admin Agent" },
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
  // add more
];
