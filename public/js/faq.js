function toggleAnswer(card) {
    const answer = card.querySelector('.faq-answer');
    const isVisible = answer.style.display === 'block';
  
    // Ocultar todas las respuestas
    document.querySelectorAll('.faq-answer').forEach(ans => (ans.style.display = 'none'));
  
    // Mostrar la respuesta si estaba oculta
    if (!isVisible) {
      answer.style.display = 'block';
    }
  }