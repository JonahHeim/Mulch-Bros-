export default async function handler(req, res) {
  // Photo upload is a nice-to-have; for now just acknowledge receipt
  // Full implementation would forward to GHL media endpoint
  res.status(200).json({ success: true, message: 'Photo received' });
}
