export async function uploadIPFS(content: string) {
  const ipfsUpload = localStorage.getItem('IPFS_UPLOAD');
  if (ipfsUpload) {
	  const formData = new FormData();
	  formData.append("file", content);

	  const response = await fetch(ipfsUpload, {
	    method: "POST",
	    body: formData,
	  });

	  if (!response.ok) {
	    throw new Error("Failed to upload to IPFS");
	  }

	  const data = await response.json();
	  const ipfsHash = data['cid']['/'];
	  return ipfsHash;
  }
  return "";
}

export async function getContentFromIPFS(ipfsHash: string): Promise<string> {
  const ipfsGet = localStorage.getItem('IPFS_GET');
  if (ipfsGet) {
	  const response = await fetch(`${ipfsGet}/${ipfsHash}`);
	  if (!response.ok) {
	    throw new Error(`Failed to fetch content from IPFS: ${response.status} ${response.statusText}`);
	  }
	  const content = await response.text();
	  return content;
  } else {
	  return ""
  }
}
