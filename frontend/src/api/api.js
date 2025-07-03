import axios from "axios";

const BASE_URL = "http://localhost:8080/api"; // Update if different
//Use it for Agent
// Tickets
export const fetchTickets = () => axios.get(`${BASE_URL}/tickets`);
export const updateTicket = (id, data) => axios.put(`${BASE_URL}/tickets/${id}`, data);

// Comments
export const fetchCommentsByTicket = (ticketId) =>
  axios.get(`${BASE_URL}/tickets/${ticketId}/comments`);
export const addComment = (ticketId, comment) =>
  axios.post(`${BASE_URL}/tickets/${ticketId}/comments`, comment);
