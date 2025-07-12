// zedshop.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://fcbddbmlopwipvrxgeta.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjYmRkYm1sb3B3aXB2cnhnZXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDU1MjgsImV4cCI6MjA2NzkyMTUyOH0.RhoMQn60E7NGFAgm_KJW8umdn-mnQpIErylMpydeWJI'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault()

  const name = document.getElementById('name').value
  const whatsapp = document.getElementById('whatsapp').value
  const price = document.getElementById('price').value
  const category = document.getElementById('category').value
  const imageFile = document.getElementById('image').files[0]

  if (!imageFile) {
    alert('Please select an image.')
    return
  }

  const fileName = `${Date.now()}_${imageFile.name}`

  // Upload image to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('spj') // bucket name
    .upload(fileName, imageFile)

  if (uploadError) {
    console.error('Image upload failed:', uploadError.message)
    alert('Failed to upload image.')
    return
  }

  // Get public URL
  const { data: publicUrlData } = supabase
    .storage
    .from('spj')
    .getPublicUrl(fileName)

  const imageUrl = publicUrlData.publicUrl

  // Save product to database
  const { error: insertError } = await supabase
    .from('products')
    .insert([
      {
        name,
        whatsapp,
        price,
        category,
        image_url: imageUrl
      }
    ])

  if (insertError) {
    console.error('Database insert failed:', insertError.message)
    alert('Failed to save product info.')
    return
  }

  alert('Product uploaded successfully!')
  document.getElementById('product-form').reset()
})
