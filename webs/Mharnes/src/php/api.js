const COMMENTS_API = import.meta.env.VITE_COMMENTS_API;

// Crea un comentario público
export async function createPublicComment({ author, body, rating, files, institution }) {
  const fd = new FormData();
  fd.append("author_name", author);
  fd.append("institution", institution || "");
  fd.append("content", body);
  fd.append("rating", rating || 5);
  
  if (files && files.length > 0) {
    files.forEach(file => {
      fd.append("photo_files", file);
    });
  }
  
  const res = await fetch(COMMENTS_API, { method: "POST", body: fd });
  if (!res.ok) throw new Error(`POST ${res.status}`);
  return res.json();
}

export async function listPublicComments() {
  // FastAPI handles pagination differently if implemented, for now we just get all verified
  const res = await fetch(`${COMMENTS_API}`, {
    headers: { 'x-api-key': '<Donemilio@2026>' }
  }); 
  if (!res.ok) throw new Error(`GET ${res.status}`);
  return res.json();
}
