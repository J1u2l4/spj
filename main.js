import { createClient } from 'https://esm.sh/@supabase/supabase-js'

// ⬇️ Replace with your actual Supabase project URL and anon key
const supabaseUrl = 'https://fcbddbmlopwipvrxgeta.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjYmRkYm1sb3B3aXB2cnhnZXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDU1MjgsImV4cCI6MjA2NzkyMTUyOH0.RhoMQn60E7NGFAgm_KJW8umdn-mnQpIErylMpydeWJI'
const supabase = createClient(supabaseUrl, supabaseKey)

const productList = document.getElementById('product-list')
const searchInput = document.getElementById('search')

let products = []

async function loadProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Error loading products from Supabase:', error)
    productList.innerHTML = '<p>Failed to load products.</p>'
    return
  }

  console.log('✅ Raw data from Supabase:', data)

  products = data

  // Log what's about to be shown
  console.log('✅ Displaying products:', products)

  displayProducts(products)
}

function displayProducts(filteredProducts) {
  productList.innerHTML = ''
  if (filteredProducts.length === 0) {
    productList.innerHTML = '<p>No products found.</p>'
    return
  }

  filteredProducts.forEach(product => {
    const div = document.createElement('div')
    div.className = 'product'
    div.innerHTML = `
      <h2>${product.name}</h2>
      <p>ZMW ${product.price || 'N/A'}</p>
      <p>📱 <a href="https://wa.me/${product.whatsapp}" target="_blank">${product.whatsapp}</a></p>
      <img src="${product.image_url}" alt="${product.name}" />
      <p><strong>Category:</strong> ${product.category}</p>
    `
    productList.appendChild(div)
  })
}

// 🔍 Search functionality
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase()
  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm)
  )
  displayProducts(filtered)
})


// 🚀 Start loading products
loadProducts()
