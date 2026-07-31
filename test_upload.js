const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gmrtkxqimutoisuwdvwq.supabase.co',
  'sb_publishable_SOR36xL5n_xoJtAVTAyJsw_RIW9eEJC'
);

async function testUpload() {
  console.log('Testing upload...');
  const fileContent = Buffer.from('test image content');
  const fileName = `test-${Date.now()}.txt`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('photo_wall')
    .upload(`wall/${fileName}`, fileContent, {
      contentType: 'text/plain',
      upsert: false
    });
    
  if (uploadError) {
    console.error('Upload Error:', uploadError);
    return;
  }
  console.log('Upload Success:', uploadData);
  
  const { data: publicUrlData } = supabase.storage
    .from('photo_wall')
    .getPublicUrl(`wall/${fileName}`);
    
  console.log('Public URL:', publicUrlData.publicUrl);
  
  console.log('Testing Insert...');
  const { data: insertData, error: insertError } = await supabase
    .from('photo_wall')
    .insert({
      image_url: publicUrlData.publicUrl,
      uploader_name: 'Tester',
      caption: 'Test caption',
      status: 'pending'
    })
    .select()
    .single();
    
  if (insertError) {
    console.error('Insert Error:', insertError);
    return;
  }
  
  console.log('Insert Success:', insertData);
}

testUpload();
