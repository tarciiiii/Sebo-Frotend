
async function fetchAndDisplayBooks() {
    try {
        const response = await fetch('http://localhost:5029/api/livro/');
        if (!response.ok) {
            throw new Error('Erro ao obter os livros.');
        }
        const livros = await response.json();

        const cardContainer = document.getElementById('card-container');
        cardContainer.innerHTML = ''; // Limpa o conteúdo atual

        livros.forEach(livro => {
           
            const card = document.createElement('div');
            card.classList.add('book-card');

           
            card.innerHTML = `
                <img src="${livro.imgUrl}" alt="${livro.titulo}">
                <h3>${livro.titulo}</h3>
                <h4>Preço: R$ ${livro.preco.toFixed(2)}</h4>
                <button class="detalhes-livro" data-id="${livro.livroId}">Detalhes</button>
            `;
            const maxCharacters = 30;
            const titleElement = card.querySelector('h3');
            let titleText = livro.titulo;
        
            if (titleText.length > maxCharacters) {
                titleText = titleText.substring(0, maxCharacters) + '...';
            }
        
            titleElement.textContent = titleText;

            cardContainer.appendChild(card);
        });

       
        document.querySelectorAll('.detalhes-livro').forEach(button => {
            button.addEventListener('click', (event) => {
                const livroId = event.target.getAttribute('data-id');
                window.location.href = `detalhes.html?id=${livroId}`;
            });
        });
    } catch (error) {
        console.error('Erro ao buscar livros:' + error);
    }
}


function getGeneroString(generoValue) {
    switch (generoValue) {
        case 0:
            return 'Romance';
        case 1:
            return 'Ficção Científica';
        case 2:
            return 'Fantasia';
        case 3:
            return 'Suspense';
        case 4:
            return 'Terror';
        case 5:
            return 'Drama';
        case 6:
            return 'Poesia';
        case 7:
            return 'Aventura';
        case 8:
            return 'Biografia';
        case 9:
            return 'Autoajuda';
        case 10:
            return 'História';
        case 11:
            return 'Infantojuvenil';
        case 12:
            return 'Outros';
        default:
            return 'Desconhecido';
    }
}


function getGeneroEnumValue(generoString) {
    switch (generoString.toLowerCase()) {
        case 'romance':
            return 0;
        case 'ficcaocientifica':
            return 1;
        case 'fantasia':
            return 2;
        case 'suspense':
            return 3;
        case 'terror':
            return 4;
        case 'drama':
            return 5;
        case 'poesia':
            return 6;
        case 'aventura':
            return 7;
        case 'biografia':
            return 8;
        case 'autoajuda':
            return 9;
        case 'historia':
            return 10;
        case 'infantojuvenil':
            return 11;
        case 'outros':
            return 12;
        default:
            return 12; 
    }
}


async function loadBookDetails() {
    const params = new URLSearchParams(window.location.search);
    const livroId = params.get('id');

    if (!livroId) {
        alert('ID do livro não especificado na URL.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5029/api/livro/${livroId}`);
        if (!response.ok) {
            throw new Error('Erro ao obter os detalhes do livro.');
        }
        const livro = await response.json();

        const detalhesImg = document.getElementById('detalhes-img');
        const detalhesTitulo = document.getElementById('detalhes-titulo');
        const detalhesAutor = document.getElementById('detalhes-autor');
        const detalhesPreco = document.getElementById('detalhes-preco');
        const detalhesDescricao = document.getElementById('detalhes-descricao');
        const detalhesAvaliacao = document.getElementById('detalhes-avaliacao');

        detalhesImg.src = livro.imgUrl;
        detalhesImg.alt = livro.titulo;
        detalhesTitulo.textContent = livro.titulo;
        detalhesAutor.textContent = `Autor: ${livro.autor}`;
        detalhesPreco.textContent = `Preço: R$ ${livro.preco.toFixed(2)}`;
        detalhesDescricao.textContent = `Descrição: ${livro.descricao}`;
        detalhesAvaliacao.textContent = `Avaliação: ${livro.avaliacao || 'Não avaliado'}`;

        
        const editarButton = document.getElementById('editar-livro');
        editarButton.addEventListener('click', () => {
            window.location.href = `editar.html?id=${livroId}`;
        });
    } catch (error) {
        console.error('Erro ao buscar detalhes do livro:', error);
        alert('Erro ao buscar detalhes do livro.');
    }
}


async function loadEditForm() {
    const params = new URLSearchParams(window.location.search);
    const livroId = params.get('id');

    if (!livroId) {
        alert('ID do livro não especificado na URL.');
        return;
    }

    const form = document.getElementById('form-editar-livro');

    try {
        const response = await fetch(`http://localhost:5029/api/livro/${livroId}`);
        if (!response.ok) {
            throw new Error('Erro ao obter os detalhes do livro.');
        }
        const livro = await response.json();

        document.getElementById('titulo').value = livro.titulo;
        document.getElementById('autor').value = livro.autor;
        document.getElementById('imgUrl').value = livro.imgUrl;
        document.getElementById('genero').value = getGeneroString(livro.genero);
        document.getElementById('preco').value = livro.preco;
        document.getElementById('avaliacao').value = livro.avaliacao;
        document.getElementById('descricao').value = livro.descricao;
        document.getElementById('quantidade').value = livro.quantidade;
        document.getElementById('isbn').value = livro.isbn;
        document.getElementById('anoPublicacao').value = livro.anoPublicacao;
        document.getElementById('editora').value = livro.editora;
    } catch (error) {
        console.error('Erro ao buscar detalhes do livro:', error);
        alert('Erro ao buscar detalhes do livro.');
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        const livroAtualizado = {
            livroId: livroId,
            titulo: formData.get('titulo'),
            autor: formData.get('autor'),
            imgUrl: formData.get('imgUrl'),
            genero: getGeneroEnumValue(formData.get('genero')), 
            preco: parseFloat(formData.get('preco')),
            avaliacao: parseInt(formData.get('avaliacao')),
            descricao: formData.get('descricao'),
            quantidade: parseInt(formData.get('quantidade')),
            isbn: formData.get('isbn'),
            anoPublicacao: parseInt(formData.get('anoPublicacao')),
            editora: formData.get('editora')
        };

        try {
            const response = await fetch(`http://localhost:5029/api/livro/${livroId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(livroAtualizado)
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar livro.');
            }

            alert('Livro atualizado com sucesso!');
            window.location.href = `detalhes.html?id=${livroId}`;
        } catch (error) {
            console.error('Erro ao atualizar livro:', error);
            alert('Erro ao atualizar livro. Verifique os dados e tente novamente.');
        }
    });
}


async function cadastrarLivro(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const livro = {
        titulo: formData.get('titulo'),
        autor: formData.get('autor'),
        imgUrl: formData.get('imgUrl'),
        genero: getGeneroEnumValue(formData.get('genero')),
        preco: parseFloat(formData.get('preco')),
        avaliacao: parseInt(formData.get('avaliacao')) || null,
        descricao: formData.get('descricao'),
        quantidade: parseInt(formData.get('quantidade')),
        ISBN: formData.get('isbn'),
        anoPublicacao: parseInt(formData.get('anoPublicacao')),
        editora: formData.get('editora')
    };

    try {
        const response = await fetch('http://localhost:5029/api/livro/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livro)
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar livro.');
        }

        alert('Livro cadastrado com sucesso!');
        form.reset(); 

       
        fetchAndDisplayBooks();

    } catch (error) {
        console.error('Erro ao cadastrar livro:', error);
        alert('Erro ao cadastrar livro. Verifique os dados e tente novamente.');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayBooks();

    const formCadastrarLivro = document.getElementById('form-cadastrar-livro');
    if (formCadastrarLivro) {
        formCadastrarLivro.addEventListener('submit', cadastrarLivro);
    }

    if (window.location.pathname.endsWith('detalhes.html')) {
        loadBookDetails();
    }

    if (window.location.pathname.endsWith('editar.html')) {
        loadEditForm();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    
    fetchAndDisplayBooks();

   
    if (window.location.pathname.endsWith('detalhes.html')) {
        loadBookDetails();

        
        const deletarButton = document.getElementById('deletar-livro');
        if (deletarButton) {
            deletarButton.addEventListener('click', () => {
                
                const modal = document.getElementById('modal-confirmacao');
                modal.style.display = 'flex'; // Exibe o modal

               
                const confirmarExclusaoButton = document.getElementById('confirmar-exclusao');
                const cancelarExclusaoButton = document.getElementById('cancelar-exclusao');

               
                confirmarExclusaoButton.addEventListener('click', async () => {
                    const livroId = new URLSearchParams(window.location.search).get('id');
                    try {
                        const response = await fetch(`http://localhost:5029/api/livro/${livroId}`, {
                            method: 'DELETE',
                        });

                        if (!response.ok) {
                            throw new Error('Erro ao excluir livro.');
                        }

                        alert('Livro excluído com sucesso!');
                        window.location.href = 'index.html'; 

                    } catch (error) {
                        console.error('Erro ao excluir livro:', error);
                        alert('Erro ao excluir livro. Verifique a conexão ou tente novamente mais tarde.');
                    }
                });

               
                cancelarExclusaoButton.addEventListener('click', () => {
                    modal.style.display = 'none'; // Oculta o modal
                });
            });
        }
    }

    
    async function loadBookDetails() {
        const params = new URLSearchParams(window.location.search);
        const livroId = params.get('id');

        if (!livroId) {
            alert('ID do livro não especificado na URL.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5029/api/livro/${livroId}`);
            if (!response.ok) {
                throw new Error('Erro ao obter os detalhes do livro.');
            }
            const livro = await response.json();

            const detalhesImg = document.getElementById('detalhes-img');
            const detalhesTitulo = document.getElementById('detalhes-titulo');
            const detalhesAutor = document.getElementById('detalhes-autor');
            const detalhesPreco = document.getElementById('detalhes-preco');
            const detalhesDescricao = document.getElementById('detalhes-descricao');
            const detalhesAvaliacao = document.getElementById('detalhes-avaliacao');

            detalhesImg.src = livro.imgUrl;
            detalhesImg.alt = livro.titulo;
            detalhesTitulo.textContent = livro.titulo;
            detalhesAutor.textContent = `Autor: ${livro.autor}`;
            detalhesPreco.textContent = `Preço: R$ ${livro.preco.toFixed(2)}`;
            detalhesDescricao.textContent = `Descrição: ${livro.descricao}`;
            detalhesAvaliacao.textContent = `Avaliação: ${livro.avaliacao || 'Não avaliado'}`;

            
            const editarButton = document.getElementById('editar-livro');
            editarButton.addEventListener('click', () => {
                window.location.href = `editar.html?id=${livroId}`;
            });
        } catch (error) {
            console.error('Erro ao buscar detalhes do livro:', error);
            alert('Erro ao buscar detalhes do livro.');
        }
    }

   
    async function fetchAndDisplayBooks() {
        // Implementação omitida para focar no evento de deletar
    }
});
