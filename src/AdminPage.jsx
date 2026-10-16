import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ImagePlus, LogOut, PackagePlus, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CATEGORIES, deleteProduct, getProducts, saveProduct, signInAdmin, signOutAdmin } from "./productStore.js";
import { useProductImage } from "./useProductImage.js";

const EMPTY_FORM = { name: "", category: "", condition: "", price: "", reference: "", description: "", seoTitle: "", seoDescription: "", negotiable: false };

function AdminProduct({ product, onEdit, onDelete }) {
  const image = useProductImage(product.imageUrl);
  return (
    <motion.article className="admin-product" layout initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
      {image ? <img src={image} alt="" /> : <span className="admin-product__placeholder">FJPM</span>}
      <div><strong>{product.name}</strong><small>{product.category} · {new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(product.price)}</small></div>
      <div className="admin-product__actions">
        <button type="button" onClick={() => onEdit(product)} aria-label={`Editar ${product.name}`}><Pencil size={14} /></button>
        <button type="button" onClick={() => onDelete(product)} aria-label={`Apagar ${product.name}`}><Trash2 size={14} /></button>
      </div>
    </motion.article>
  );
}

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInAdmin(email, password);
      onLogin();
    } catch (loginError) {
      console.error("Falha de autenticação de administrador:", loginError);
      setError(loginError instanceof Error ? loginError.message : "Não foi possível iniciar sessão.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.section className="admin-login" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}>
      <Link to="/"><img className="admin-login__logo" src="/fjpm-logo.svg" alt="FJPM Peças Auto" /></Link>
      <span className="admin-kicker"><span /> Painel privado</span>
      <h1>Acesso reservado</h1>
      <p>Inicia sessão com a conta administradora para gerir a loja.</p>
      <form onSubmit={submit}>
        <div className="form-field"><label htmlFor="admin-email">Email</label><input id="admin-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required autoFocus /></div>
        <div className="form-field"><label htmlFor="admin-password">Palavra-passe</label><input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
        <p className="admin-message" role="alert">{error}</p>
        <button className="button" type="submit" disabled={loading}>{loading ? "A autenticar…" : "Entrar no admin"} <span>↗</span></button>
      </form>
      <Link className="login-back" to="/"><ArrowLeft size={14} /> Voltar à loja</Link>
    </motion.section>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => setProducts(await getProducts()), []);
  useEffect(() => {
    if (!authenticated) return;
    refresh().catch((error) => {
      console.error("Erro ao carregar produtos:", error);
      setMessage("Não foi possível carregar os produtos guardados.");
      setIsError(true);
    });
  }, [authenticated, refresh]);

  const change = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const edit = (product) => {
    setEditingId(product.id);
    setSelectedImage(null);
    setForm({ name: product.name, category: product.category, condition: product.condition, price: String(product.price), reference: product.reference ?? "", description: product.description, seoTitle: product.seoTitle, seoDescription: product.seoDescription, negotiable: product.negotiable });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setEditingId("");
    setSelectedImage(null);
    setMessage("");
    const input = document.querySelector("#product-image");
    if (input) input.value = "";
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const current = editingId ? products.find((product) => product.id === editingId) : null;
      if (!current && !selectedImage) {
        setMessage("Adiciona uma imagem para publicar o produto.");
        setIsError(true);
        return;
      }
      const price = Number(form.price);
      if (!Number.isFinite(price) || price < 0) throw new Error("Indica um preço válido.");
      const product = {
        ...form,
        name: form.name.trim(),
        reference: form.reference.trim(),
        description: form.description.trim(),
        seoTitle: form.seoTitle.trim(),
        seoDescription: form.seoDescription.trim(),
        price,
        imagePath: current?.imagePath ?? "",
        id: editingId || crypto.randomUUID(),
        createdAt: current?.createdAt,
      };
      await saveProduct(product, selectedImage);
      await refresh();
      reset();
      setMessage("Produto guardado com sucesso.");
      setIsError(false);
    } catch (error) {
      console.error("Erro ao guardar produto:", error);
      setMessage(error instanceof Error ? error.message : "Não foi possível guardar o produto.");
      setIsError(true);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (product) => {
    if (!window.confirm(`Apagar "${product.name}"?`)) return;
    try {
      const cleanupMessage = await deleteProduct(product);
      await refresh();
      if (editingId === product.id) reset();
      if (cleanupMessage) {
        setMessage(cleanupMessage);
        setIsError(true);
      }
    } catch (error) {
      console.error("Erro ao apagar produto:", error);
      setMessage("Não foi possível apagar o produto. Tenta novamente.");
      setIsError(true);
    }
  };

  const logout = async () => {
    try {
      await signOutAdmin();
      setAuthenticated(false);
    } catch (error) {
      console.error("Erro ao terminar sessão:", error);
      setMessage("Não foi possível terminar a sessão.");
      setIsError(true);
    }
  };

  if (!authenticated) return <main className="admin-page"><div className="admin-shell"><AdminLogin onLogin={() => setAuthenticated(true)} /></div></main>;

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-top"><Link to="/"><img src="/fjpm-logo.svg" alt="FJPM Peças Auto" /></Link><div><Link to="/loja"><ArrowLeft size={14} /> Ver loja</Link><button type="button" onClick={logout}><LogOut size={14} /> Sair</button></div></header>
        <motion.div className="admin-heading" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <span className="eyebrow">Área de gestão</span><h1>O teu catálogo.<br /><em>O teu controlo.</em></h1><p>Cria anúncios completos, melhora a sua apresentação e mantém a loja atualizada.</p>
        </motion.div>
        <div className="admin-layout">
          <motion.section className="admin-panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }}>
            <div className="admin-panel__heading"><span className="admin-panel__icon"><PackagePlus size={18} /></span><div><h2>{editingId ? "Editar produto" : "Novo produto"}</h2><p>Campos marcados com * são obrigatórios.</p></div></div>
            <form onSubmit={submit}>
              <div className="form-grid">
                <div className="form-field form-field--full"><label htmlFor="product-name">Nome do produto *</label><input id="product-name" name="name" value={form.name} onChange={change} maxLength={100} required /></div>
                <div className="form-field"><label htmlFor="product-category">Categoria *</label><select id="product-category" name="category" value={form.category} onChange={change} required><option value="">Escolher categoria</option>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></div>
                <div className="form-field"><label htmlFor="product-condition">Estado *</label><select id="product-condition" name="condition" value={form.condition} onChange={change} required><option value="">Escolher estado</option><option>Usada</option><option>Nova</option><option>Recondicionada</option></select></div>
                <div className="form-field"><label htmlFor="product-price">Preço (€) *</label><input id="product-price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} required /></div>
                <div className="form-field"><label htmlFor="product-reference">Referência</label><input id="product-reference" name="reference" value={form.reference} onChange={change} maxLength={60} /></div>
                <div className="form-field form-field--full"><label htmlFor="product-description">Descrição *</label><textarea id="product-description" name="description" value={form.description} onChange={change} maxLength={1200} required /></div>
                <div className="form-field form-field--full"><label className="upload-zone" htmlFor="product-image"><ImagePlus size={20} /><span>{selectedImage?.name ?? (editingId ? "Trocar imagem do produto" : "Adicionar imagem do produto *")}</span><small>JPG, PNG ou WebP · máximo 15 MB</small></label><input className="file-input" id="product-image" type="file" accept="image/*" required={!editingId} onChange={(event) => setSelectedImage(event.target.files?.[0] ?? null)} /></div>
                <p className="form-hint form-field--full">A imagem é otimizada automaticamente antes de ser guardada.</p>
                <div className="form-field form-field--full"><label htmlFor="product-seo-title">Título SEO *</label><input id="product-seo-title" name="seoTitle" value={form.seoTitle} onChange={change} maxLength={65} required /><small className="field-counter">{form.seoTitle.length}/65</small></div>
                <div className="form-field form-field--full"><label htmlFor="product-seo-description">Descrição SEO *</label><textarea id="product-seo-description" name="seoDescription" value={form.seoDescription} onChange={change} maxLength={160} required /><small className="field-counter">{form.seoDescription.length}/160</small></div>
              </div>
              <label className="checkbox-field"><input name="negotiable" type="checkbox" checked={form.negotiable} onChange={change} /><span>Aceita propostas para este produto</span></label>
              <p className={`admin-message ${isError ? "" : "admin-message--success"}`} role="status">{message}</p>
              <div className="admin-form-actions"><button className="button" type="submit" disabled={saving}>{saving ? "A guardar…" : editingId ? "Guardar alterações" : "Publicar produto"} <span>↗</span></button>{editingId && <button className="button button--outline" type="button" onClick={reset}>Cancelar</button>}</div>
            </form>
          </motion.section>
          <motion.section className="admin-panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16 }}>
            <div className="admin-panel__heading"><span className="admin-panel__icon"><PackagePlus size={18} /></span><div><h2>Produtos publicados</h2><p>{products.length} {products.length === 1 ? "artigo" : "artigos"} na loja</p></div></div>
            <div className="admin-products">
              {!products.length && <div className="admin-empty"><PackagePlus size={24} /><strong>A loja começa aqui.</strong><span>Adiciona o primeiro produto no formulário.</span></div>}
              <AnimatePresence initial={false}>{products.map((product) => <AdminProduct key={product.id} product={product} onEdit={edit} onDelete={remove} />)}</AnimatePresence>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
