
function generarCodigoCanje() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const longitudCodigo = 25;
    let codigo = '';
  
    for (let i = 0; i < longitudCodigo; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      codigo += caracteres.charAt(indice);
  
      // Agregar un guion después de cada 5 caracteres generados
      if ((i + 1) % 5 === 0 && i !== longitudCodigo - 1) {
        codigo += '-';
      }
    }
    return codigo;
  }
  
  const codigoGenerado = generarCodigoCanje();
  
  module.exports= {
    generarCodigoCanje
  };