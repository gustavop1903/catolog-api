import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const client = new S3Client({ region: "us-east-1" });

export const handler = async (event) => {
  try {
    for (const record of event.Records) {
      console.log("Iniciando processamento", record);

      const rowBody = JSON.parse(record.body);
      const body = JSON.parse(rowBody.Message);

      const ownerId = body.ownerId;
      const bucketName = "catalog-mkt-s3";
      const fileName = `${ownerId}-catalog.json`;

      try {
        const catalog = await getS3Object(bucketName, fileName);
        const catalogData = JSON.parse(catalog);

        if (body.id && Object.keys(body).length === 1) {
          const itemDeleted = deleteItemById(catalogData, body.id);
          if (!itemDeleted) {
            console.log("O item com o ID fornecido não foi encontrado para exclusão.");
          }
          await putS3Object(bucketName, fileName, JSON.stringify(catalogData));
        } else if (body.categoryId) {
          const { __v, ownerId, ...newProduct } = body
          updateOrAddProduct(catalogData.categories, body.categoryId, newProduct);
          await putS3Object(bucketName, fileName, JSON.stringify(catalogData));
        } else {
          const { __v, ownerId, ...newCategory } = body
          updateOrAddCategory(catalogData.categories, newCategory);
          await putS3Object(bucketName, fileName, JSON.stringify(catalogData));
        }

      } catch (e) {
        if (e.message === "Error getting object from bucket") {
          const newCatalog = { categories: [] };
          // const newCategory = { ...body, products: [] }
          const { __v, ownerId, ...newCategory } = body
          newCategory.products = []
          newCatalog.categories.push(newCategory)
          await putS3Object(bucketName, fileName, JSON.stringify(newCatalog));
        } else {
          throw e;
        }
      }
    }

    return { status: 'sucesso' };

  } catch (e) {
    console.log("Error:", e);
    throw new Error("Erro ao processar mensagem");
  }
};


async function getS3Object(bucket, key) {
  const getCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  });
  try {
    const response = await client.send(getCommand);

    return streamToString(response.Body);

  } catch (e) {
    throw new Error('Error getting object from bucket');
  }
}

function updateOrAddProduct(categories, categoryId, newProduct) {
  const categoryIndex = categories.findIndex(category => category._id === categoryId);
  if (categoryIndex !== -1) {
    const productIndex = categories[categoryIndex].products.findIndex(product => product._id === newProduct.id);
    if (productIndex !== -1) {
      categories[categoryIndex].products[productIndex] = { ...categories[categoryIndex].products[productIndex], ...newProduct };
    } else {
      categories[categoryIndex].products.push(newProduct);
    }
  } else {
    throw new Error('Categoria não encontrada');
  }
}

function updateOrAddCategory(categories, newCategory) {
  const index = categories.findIndex(category => category.title === newCategory.title);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...newCategory };
  } else {
    newCategory.products = []
    categories.push(newCategory);
  }
}

async function putS3Object(dstBucket, dstKey, content) {
  try {
    const putCommand = new PutObjectCommand({
      Bucket: dstBucket,
      Key: dstKey,
      Body: content,
      ContentType: "application/json"
    });
    const putResult = await client.send(putCommand);
    return putResult
  } catch (e) {
    console.log(e);
    return
  }
}

function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    stream.on('error', reject);
  });
};

function deleteItemById(catalogData, itemId) {
  for (const category of catalogData.categories) {
    const productIndex = category.products.findIndex(product => product._id === itemId);
    if (productIndex !== -1) {
      category.products.splice(productIndex, 1);
      return true;
    }
  }
  const categoryIndex = catalogData.categories.findIndex(category => category._id === itemId);
  if (categoryIndex !== -1) {
    catalogData.categories.splice(categoryIndex, 1);
    return true;
  }

  return false;
}