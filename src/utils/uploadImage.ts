export async function uploadImage(
  imageUri:string
):Promise<string>{

  const formData =
    new FormData();

  formData.append(
    'file',
    {
      uri:imageUri,
      type:'image/jpeg',
      name:`image-${Date.now()}.jpg`,
    } as any
  );

  formData.append(
    'upload_preset',
    'upd-haredo'
  );

  const response =
    await fetch(
      'https://api.cloudinary.com/v1_1/dqpf9poer/image/upload',
      {
        method:'POST',
        body:formData
      }
    );

  const data =
    await response.json();

  console.log(
    'Cloudinary:',
    data
  );

  if(!response.ok){

    throw new Error(
      data?.error?.message ||
      'Erro ao enviar imagem'
    );

  }

  return data.secure_url;
}