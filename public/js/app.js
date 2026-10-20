// Fungsi untuk memuat dan menampilkan daftar menu saat halaman dibuka
async function loadMenus() {
  try {
    const response = await fetch('/api/menus');
    const result = await response.json();
    
    const container = document.getElementById('menu-container');
    if (!container) return;

    const menus = Array.isArray(result) ? result : (result.data || result.menus || []);

    if (menus.length > 0) {
      container.innerHTML = menus.map(menu => `
        <div style="border: 1px solid #ddd; padding: 15px; margin: 10px; border-radius: 8px; display: inline-block; width: 200px; text-align: left; background: #fff; vertical-align: top;">
            <img src="${menu.image_url || 'default.png'}" alt="${menu.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; background: #eee;" onerror="this.style.display='none'">
            <h4 style="margin: 10px 0 5px 0;">${menu.name}</h4>
            <p style="margin: 0; color: #666; font-weight: bold;">Rp ${menu.price}</p>
            <p style="font-size: 12px; color: #888; margin-top: 5px;">Stok: ${menu.stock}</p>
        </div>
      `).join('');
    } else {
      container.innerHTML = "<p>Belum ada menu tersedia.</p>";
    }
  } catch (err) {
    console.error('Gagal memuat menu:', err);
    const container = document.getElementById('menu-container');
    if (container) {
      container.innerHTML = "<p>Gagal memuat data menu dari server.</p>";
    }
  }
}

// Jalankan fungsi loadMenus saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', loadMenus);

// Fungsi untuk Tambah Menu Baru dari Modal Admin
async function submitNewMenu(event) {
  event.preventDefault();
  
  const form = document.getElementById('add-menu-form');
  const formData = new FormData();
  
  formData.append('name', document.getElementById('menu-name').value);
  formData.append('category_id', document.getElementById('menu-category').value);
  formData.append('price', document.getElementById('menu-price').value);
  formData.append('stock', document.getElementById('menu-stock').value);
  formData.append('description', document.getElementById('menu-desc').value);
  
  // Mengambil file foto yang diunggah
  const imageInput = document.getElementById('menu-image-file');
  if (imageInput.files[0]) {
    formData.append('image', imageInput.files[0]);
  }

  try {
    const response = await fetch('/api/menus', {
      method: 'POST',
      body: formData // multipart/form-data dikirim otomatis
    });

    const result = await response.json();
    if (result.success) {
      alert('Menu & Foto Berhasil Ditambahkan!');
      location.reload(); // Refresh daftar menu
    } else {
      alert('Gagal: ' + result.message);
    }
  } catch (err) {
    console.error('Error uploading menu:', err);
  }
}