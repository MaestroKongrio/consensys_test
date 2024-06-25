import React from 'react';

interface NFTProps {
    name: string;
    tokenId: number;
    image: string;
    description: string;
    getApproved: string;
  }

// Componente NFT que recibe varias propiedades
const NFTCard:React.FC<NFTProps>= ({ name, tokenId, image, description, getApproved }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px', width: '300px' }}>
      <img src={image} alt={name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <h3>{name}</h3>
      <p>{description}</p>
      <p><strong>ID del Token:</strong> {tokenId}</p>
      <p><strong>Aprobado:</strong> {getApproved ? 'Sí' : 'No'}</p>
    </div>
  );
};

export default NFTCard;