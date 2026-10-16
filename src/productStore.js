import { requireSupabase } from "./supabase.js";

export const CATEGORIES = ["Motor", "Travagem", "Suspensão", "Carroçaria", "Elétrica", "Interior", "Outros"];
const BUCKET = "product-images";

function explainSupabaseError(error, resource) {
  const message = error instanceof Error ? error.message : String(error);
  if (/row-level security|not authorized|permission denied|unauthorized/i.test(message)) {
    return new Error(`O Supabase recusou a gravação da ${resource}. Confirma que o utilizador está em public.store_admins e que as políticas do ficheiro supabase/schema.sql foram executadas.`);
  }
  if (/bucket .*not found|bucket not found/i.test(message)) {
    return new Error("O armazenamento de imagens ainda não está configurado. Executa novamente o ficheiro supabase/schema.sql no SQL Editor.");
  }
  if (/could not find the table|relation .* does not exist|schema cache/i.test(message)) {
    return new Error("A tabela de produtos ainda não está configurada. Executa o ficheiro supabase/schema.sql no SQL Editor e atualiza a página.");
  }
  return error instanceof Error ? error : new Error(`Não foi possível guardar a ${resource}.`);
}

function fromDatabase(row, client) {
  const { data } = client.storage.from(BUCKET).getPublicUrl(row.image_path);
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    condition: row.condition,
    price: Number(row.price),
    reference: row.reference,
    description: row.description,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    negotiable: row.negotiable,
    imagePath: row.image_path,
    imageUrl: data.publicUrl,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getProducts() {
  const client = requireSupabase();
  const { data, error } = await client.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data.map((row) => fromDatabase(row, client));
}

export async function signInAdmin(email, password) {
  const client = requireSupabase();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const { data: admin, error: accessError } = await client
    .from("store_admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (accessError || !admin) {
    await client.auth.signOut();
    throw accessError ?? new Error("Esta conta não tem acesso ao painel de administração.");
  }
  return data.user;
}

export async function signOutAdmin() {
  const { error } = await requireSupabase().auth.signOut();
  if (error) throw error;
}

export async function saveProduct(product, imageFile) {
  const client = requireSupabase();
  let imagePath = product.imagePath ?? "";
  let uploadedPath = "";

  if (imageFile) {
    if (!(imageFile instanceof File) || !imageFile.type.startsWith("image/")) {
      throw new Error("Escolhe um ficheiro de imagem válido.");
    }
    if (imageFile.size > 15 * 1024 * 1024) throw new Error("A imagem deve ter menos de 15 MB.");
    const image = await prepareImage(imageFile);
    uploadedPath = `${product.id}/${crypto.randomUUID()}.webp`;
    const { error: uploadError } = await client.storage.from(BUCKET).upload(uploadedPath, image, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });
    if (uploadError) throw explainSupabaseError(uploadError, "imagem");
    imagePath = uploadedPath;
  }

  if (!imagePath) throw new Error("Adiciona uma imagem para publicar o produto.");
  const { data, error } = await client.from("products").upsert({
    id: product.id,
    name: product.name,
    category: product.category,
    condition: product.condition,
    price: product.price,
    reference: product.reference,
    description: product.description,
    seo_title: product.seoTitle,
    seo_description: product.seoDescription,
    negotiable: product.negotiable,
    image_path: imagePath,
    created_at: product.createdAt ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).select("*").single();

  if (error) {
    if (uploadedPath) {
      const { error: cleanupError } = await client.storage.from(BUCKET).remove([uploadedPath]);
      if (cleanupError) console.error("Não foi possível remover a imagem após falha ao guardar:", cleanupError);
    }
    throw explainSupabaseError(error, "produto");
  }

  if (uploadedPath && product.imagePath) {
    const { error: cleanupError } = await client.storage.from(BUCKET).remove([product.imagePath]);
    if (cleanupError) console.error("Não foi possível remover a imagem antiga:", cleanupError);
  }
  return fromDatabase(data, client);
}

export async function deleteProduct(product) {
  const client = requireSupabase();
  const { error } = await client.from("products").delete().eq("id", product.id);
  if (error) throw error;
  if (product.imagePath) {
    const { error: storageError } = await client.storage.from(BUCKET).remove([product.imagePath]);
    if (storageError) {
      console.error("O produto foi apagado, mas a imagem não pôde ser removida:", storageError);
      return "O produto foi apagado, mas a imagem não pôde ser removida do armazenamento.";
    }
  }
  return "";
}

export async function prepareImage(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Não foi possível processar esta imagem.");
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise((resolve, reject) => canvas.toBlob(
    (result) => result ? resolve(result) : reject(new Error("Não foi possível preparar esta imagem.")),
    "image/webp",
    .84,
  ));
  return blob;
}
