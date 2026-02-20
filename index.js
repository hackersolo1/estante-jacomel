document.addEventListener('DOMContentLoaded', () => {
    const recentsPostsList = document.querySelector('#recentPostsList');
    const postsManageList = document.querySelector('#postsManageList');
    const upcomingEventsList = document.querySelector('#upcomingEventsList');
    const manageEventsList = document.querySelector('#eventsManageList');
    lucide.createIcons();
    carregarEventos();
    carregarPosts();
    carregarMembros();
    const btnHome = document.querySelector('#btnHome');
    const btnPosts = document.querySelector('#btnPosts');
    const btnEvents = document.querySelector('#btnEvents');
    const btnTeam = document.querySelector('#btnTeam');
    document.querySelector('#view-posts').style.display = 'none';
    document.querySelector('#view-events').style.display = 'none';
    document.querySelector('#view-team').style.display = 'none';
    btnPosts.classList.remove('active');
    btnEvents.classList.remove('active');
    btnTeam.classList.remove('active');


    async function enviarNewEvent(newEventObject) {
        try {
            const response = await fetch('https://estante-jacomel.onrender.com/eventsCreate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify(newEventObject)
            });
            lucide.createIcons();
            newEventModal.style.animation = 'slideDown 0.3s ease-in-out forwards';

            eventCont();
            carregarEventos();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function carregarEventos() {
        try {
            upcomingEventsList.innerHTML = '';
            manageEventsList.innerHTML = '';
            const response = await fetch('http://localhost:3000/events');
            const data = await response.json();


            data.forEach(event => {
                const newEventCard = document.createElement('div');
                const dataFormatada = new Date(event.data_evento).toLocaleDateString('pt-BR');
                const horaFormatada = new Date(event.hora_evento).toLocaleTimeString('pt-BR');


                newEventCard.classList.add('event-item');
                newEventCard.innerHTML = `
                <div class="event-header-first">
                    <div class="event-content">
                        <div class="event-title">${event.titulo}</div>
                        <div class="event-date">${event.descricao}</div>
                    </div>
                    <div class="event-date">
                        <div class="event-date-day">${dataFormatada}</div>
                        <div class="event-date-time">22:00</div>
                    </div>
                </div>
                `

                upcomingEventsList.appendChild(newEventCard);
                lucide.createIcons();
                eventCont();
            });

            data.forEach(event2 => {
                const dataFormatada = new Date(event2.data_evento).toLocaleDateString('pt-BR');
                const manageItemCardEvent = document.createElement('div');
                manageItemCardEvent.classList.add("manage-item");
                manageItemCardEvent.innerHTML = `
                <div class="manage-item-content">
                    <div class="manage-item-title">${event2.titulo}</div>
                    <div class="manage-item-meta">${event2.descricao} - ${dataFormatada}</div>
                </div>
                <div class="manage-item-actions">
                    <button class="action-btn delete" id="deleteEventBtn" data-event-id="${event2.titulo}">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
                `
                document.querySelector('#eventsManageList').appendChild(manageItemCardEvent);
                lucide.createIcons();
            });

            document.querySelectorAll('#deleteEventBtn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-event-id');
                    deletarEvent(id);
                });
            });

        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function carregarPosts() {
        try {
            recentsPostsList.innerHTML = '';
            postsManageList.innerHTML = '';
            const response = await fetch('https://estante-jacomel.onrender.com/posts');
            const data = await response.json();

            data.forEach(post => {
                const newPostCard = document.createElement('div');
                newPostCard.classList.add('post-item');
                newPostCard.innerHTML = `
                    <div class="post-header-first">
                        <div class="post-content">
                            <div class="post-title">${post.titulo}</div>
                            <div class="post-meta">${post.autorPost} - ${post.dataPost}</div>
                        </div>
                    </div>
                    `
                recentsPostsList.appendChild(newPostCard);
                lucide.createIcons();
                postCont();
            });

            data.forEach(post => {
                const manageItemCard = document.createElement('div');
                manageItemCard.classList.add('manage-item');
                manageItemCard.innerHTML = `
                <div class="manage-item-content">
                    <div class="manage-item-title">${post.titulo}</div>
                    <div class="manage-item-meta">${post.autorPost}</div>
                </div>
                <div class="manage-item-actions">
                <button class="action-btn read" id="readPostBtn" data-post-id="${post.slugId}" title="Ver Post">
                    <i data-lucide="eye"></i>
                </button>
                    <button class="action-btn delete" id="deletePostBtn" data-post-id="${post.titulo}" title="Deletar Post">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
                `
                document.querySelector('#postsManageList').appendChild(manageItemCard);
                lucide.createIcons();
            });

            document.querySelectorAll('#deletePostBtn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-post-id');
                    deletarPost(id);
                });
            });

            document.querySelectorAll('#readPostBtn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-post-id');
                    lerPost(id);
                });
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function lerPost(id) {
        try {
            console.log(id);
            const response = await fetch(`https://estante-jacomel.onrender.com/posts/${id}`);
            const data = await response.json();

            document.querySelector('.post-content p').innerText = data.conteudo;
            document.querySelector('.post-author').innerText = data.autorPost;
            document.querySelector('.post-date').innerText = data.dataPost;
            document.querySelector('.post-title-container .post-title').innerText = data.titulo;

            document.querySelector('.readPost').style.animation = 'slideUp 0.4s ease-out forwards';

            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    document.querySelector('#readPostCloseBtn').addEventListener('click', () => {
        document.querySelector('.readPost').style.animation = 'slideDown 0.4s ease-out forwards';
    });

    async function eventCont() {
        try {
            const response = await fetch('https://estante-jacomel.onrender.com/events');
            const data = await response.json();
            const eventCont = data.length;
            if (eventCont > 0) {
                document.querySelector('.stat-value-event').textContent = eventCont;
            } else {
                document.querySelector('.stat-value-event').textContent = '0';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function postCont() {
        try {
            const response = await fetch('https://estante-jacomel.onrender.com/posts');
            const data = await response.json();
            const postCont = data.length;
            if (postCont > 0) {
                document.querySelector('.stat-value-post').textContent = postCont;
            } else {
                document.querySelector('.stat-value-post').textContent = '0';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function enviarNewPost(newPostObject) {
        try {
            const response = await fetch('https://estante-jacomel.onrender.com/postsCreate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify(newPostObject)
            });

            lucide.createIcons();
            newPostModal.style.animation = 'slideDown 0.3s ease-in-out forwards';

            postCont();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function deletarPost(id) {
        try {
            console.log(id);
            const response = await fetch(`https://estante-jacomel.onrender.com/postsDelete/${id}`);
            const data = await response.json();

            lucide.createIcons();
            if (data.message === 'Post deletado com sucesso!') {
                document.querySelector('#postsManageList').innerHTML = '';
                recentsPostsList.innerHTML = '';
                postCont();
                carregarPosts();
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function deletarEvent(id) {
        try {

            const response = await fetch(`https://estante-jacomel.onrender.com/eventsDelete/${id}`);
            const data = await response.json();

            lucide.createIcons();
            if (data.message === 'Evento deletado com sucesso!') {
                document.querySelector('#eventsManageList').innerHTML = '';
                eventCont();
                carregarEventos();
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function enviarNewMember(newMemberObject) {
        try {
            const response = await fetch('https://estante-jacomel.onrender.com/membersCreate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(newMemberObject)
            });

            lucide.createIcons();
            newMemberModal.style.animation = 'slideDown 0.3s ease-in-out forwards';

            memberCont();
            carregarMembros();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function carregarMembros() {
        try {
            document.querySelector('#teamGrid').innerHTML = '';
            const response = await fetch('https://estante-jacomel.onrender.com/members');
            const data = await response.json();

            data.forEach(member => {
                let lucideData;
                let memberAvatar

                if (member.memberFunction == 'Pastor') {
                    lucideData = 'UserRoundCheck'
                    memberAvatar = '⛪'
                }

                if (member.memberFunction == 'Diácono') {
                    lucideData = 'HandHelping'
                    memberAvatar = '🤝'
                }

                if (member.memberFunction == 'Presbítero') {
                    lucideData = 'ScrollText'
                    memberAvatar = '📜'
                }

                if (member.memberFunction == 'Evangelista') {
                    lucideData = 'Megaphone'
                    memberAvatar = '📢'
                }

                if (member.memberFunction == 'Missionário') {
                    lucideData = 'MapPin'
                    memberAvatar = '🗺️'
                }

                if (member.memberFunction == 'Cantor') {
                    lucideData = 'Mic2'
                    memberAvatar = '🎤'
                }

                if (member.memberFunction == 'Músico') {
                    lucideData = 'MapPin'
                    memberAvatar = '🎵'
                }

                if (member.memberFunction == 'Instrumentista') {
                    lucideData = 'Music'
                    memberAvatar = '🎸'
                }

                if (member.memberFunction == 'Corista') {
                    lucideData = 'Users'
                    memberAvatar = '👥'
                }

                if (member.memberFunction == 'Líder do coral') {
                    lucideData = 'Music4'
                    memberAvatar = '🎼'
                }

                if (member.memberFunction == 'Líder de grupo') {
                    lucideData = 'UserGroup'
                    memberAvatar = '👥'
                }

                if (member.memberFunction == 'Mídia') {
                    lucideData = 'Camera'
                    memberAvatar = '📷'
                }


                memberCard = document.createElement('div');
                memberCard.classList.add('team-member');
                memberCard.innerHTML = `
                <div class="team-avatar"><i data-lucide="${lucideData}"></i></div>
                <div class="team-info">
                    <h3>${member.memberName}</h3>
                    <p>${member.memberFunction}</p>
                </div>
                <div class="team-actions">
                    <button class="action-btn" id="deleteMemberBtn" data-member-id="${member.id}"><i data-lucide="trash"></i></button>
                </div>
               `
                document.querySelector('#teamGrid').appendChild(memberCard);
            });
            lucide.createIcons();

            document.querySelectorAll('#deleteMemberBtn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-member-id');
                    deletarMembro(id);
                });
            });

            memberCont();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function deletarMembro(id) {
        try {
            const response = await fetch(`https://estante-jacomel.onrender.com/membersDelete/${id}`);
            const data = await response.json();

            lucide.createIcons();
            if (data.message === 'Membro deletado com sucesso!') {
                document.querySelector('#teamGrid').innerHTML = '';
                memberCont();
                carregarMembros();
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function memberCont() {
        try {
            const response = await fetch('https://estante-jacomel.onrender.com/members');
            const data = await response.json();
            const memberCont = data.length;

            lucide.createIcons();
            document.querySelector('.stat-value-member').innerHTML = memberCont;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const newEventBtn = document.querySelector('#btnNewEvent');
    const newEventBtn2 = document.querySelector('#btnNewEvent2')
    const newEventModal = document.querySelector('#modalNewEvent');
    const newEventCancelBtn = document.querySelector('#newEventCancelBtn');

    newEventBtn.addEventListener('click', () => {
        newEventModal.style.animation = 'slideUp 0.3s ease-in-out forwards';
    });

    newEventBtn2.addEventListener('click', () => {
        newEventModal.style.animation = 'slideUp 0.3s ease-in-out forwards';
    });

    newEventCancelBtn.addEventListener('click', () => {
        newEventModal.style.animation = 'slideDown 0.3s ease-in-out forwards';
    });


    const eventTitle = document.querySelector('#eventTitle');
    const eventDate = document.querySelector('#eventDate');
    const eventTime = document.querySelector('#eventTime');
    const typeEvent = document.querySelector('#eventType');
    const localEvent = document.querySelector('#localEvent');
    const newEventCreateBtn = document.querySelector('#newEventCreateBtn');

    newEventCreateBtn.addEventListener('click', () => {
        if (eventTitle.value === '' || eventDate.value === '' || eventTime.value === '' || typeEvent.value === '' || localEvent.value === '') {
            alert('Preencha todos os campos');
        } else {
            const newEventObject = {
                titulo: eventTitle.value,
                data_evento: eventDate.value,
                hora_evento: eventTime.value,
                descricao: typeEvent.value,
                local_evento: localEvent.value
            }

            enviarNewEvent(newEventObject);

            eventCont();

            newEventModal.style.animation = 'slideDown 0.3s ease-in-out forwards';

            eventTitle.value = '';
            eventDate.value = '';
            eventTime.value = '';
        }

    });

    const newPostBtn = document.querySelector('#btnNewPost');
    const newPostBtn2 = document.querySelector('#btnNewPost2');

    const modalNewPost = document.querySelector('#modalNewPost');
    const newPostCancelBtn = document.querySelector('#newPostCancelBtn');

    newPostBtn.addEventListener('click', () => {
        modalNewPost.style.animation = 'slideUp 0.3s ease-in-out forwards';
    });

    newPostBtn2.addEventListener('click', () => {
        modalNewPost.style.animation = 'slideUp 0.3s ease-in-out forwards';
    });

    newPostCancelBtn.addEventListener('click', () => {
        modalNewPost.style.animation = 'slideDown 0.3s ease-in-out forwards';
    });

    const postTitle = document.querySelector('#postTitle');
    const postContent = document.querySelector('#postContent');
    const postAuthor = document.querySelector('#postAuthor');
    const postDate = document.querySelector('#postDate');
    const newPostCreateBtn = document.querySelector('#newPostSubmitBtn');

    newPostCreateBtn.addEventListener('click', () => {
        if (postTitle.value === '' || postContent.value === '' || postAuthor.value === '' || postDate.value === '') {
            alert('Preencha todos os campos');
        } else {
            const linkSlug = postTitle.value;
            const slugID = encodeURIComponent(linkSlug);
            const newPostObject = {
                slugId: slugID,
                titulo: postTitle.value,
                conteudo: postContent.value,
                autorPost: postAuthor.value,
                dataPost: postDate.value
            }

            enviarNewPost(newPostObject);
            postCont();
            recentsPostsList.innerHTML = '';
            postsManageList.innerHTML = '';
            carregarPosts();
            modalNewPost.style.animation = 'slideDown 0.3s ease-in-out forwards';

            postTitle.value = '';
            postContent.value = '';
        }


    });

    btnHome.addEventListener('click', () => {
        document.querySelector('.content').style.display = 'block';
        document.querySelector('#view-posts').style.display = 'none';
        document.querySelector('#view-events').style.display = 'none';
        document.querySelector('#view-team').style.display = 'none';

        btnHome.classList.add('active');
        btnPosts.classList.remove('active');
        btnEvents.classList.remove('active');
        btnTeam.classList.remove('active');

    });

    btnPosts.addEventListener('click', () => {
        document.querySelector('.content').style.display = 'none';
        document.querySelector('#view-posts').style.display = 'block';
        document.querySelector('#view-events').style.display = 'none';
        document.querySelector('#view-team').style.display = 'none';

        btnHome.classList.remove('active');
        btnPosts.classList.add('active');
        btnEvents.classList.remove('active');
        btnTeam.classList.remove('active');

    });

    btnEvents.addEventListener('click', () => {
        document.querySelector('.content').style.display = 'none';
        document.querySelector('#view-posts').style.display = 'none';
        document.querySelector('#view-events').style.display = 'block';
        document.querySelector('#view-team').style.display = 'none';

        btnHome.classList.remove('active');
        btnPosts.classList.remove('active');
        btnEvents.classList.add('active');
        btnTeam.classList.remove('active');

    });

    btnTeam.addEventListener('click', () => {
        document.querySelector('.content').style.display = 'none';
        document.querySelector('#view-posts').style.display = 'none';
        document.querySelector('#view-events').style.display = 'none';
        document.querySelector('#view-team').style.display = 'block';

        btnHome.classList.remove('active');
        btnPosts.classList.remove('active');
        btnEvents.classList.remove('active');
        btnTeam.classList.add('active');
    });

    document.querySelector('#card-link-posts').addEventListener('click', () => {
        document.querySelector('.content').style.display = 'none';
        document.querySelector('#view-posts').style.display = 'block';
        document.querySelector('#view-events').style.display = 'none';
        document.querySelector('#view-team').style.display = 'none';

        btnHome.classList.remove('active');
        btnPosts.classList.add('active');
        btnEvents.classList.remove('active');
        btnTeam.classList.remove('active');
    });

    document.querySelector('#card-link-events').addEventListener('click', () => {
        document.querySelector('.content').style.display = 'none';
        document.querySelector('#view-posts').style.display = 'none';
        document.querySelector('#view-events').style.display = 'block';
        document.querySelector('#view-team').style.display = 'none';

        btnHome.classList.remove('active');
        btnPosts.classList.remove('active');
        btnEvents.classList.add('active');
        btnTeam.classList.remove('active');
    });

    const newMemberBtn = document.querySelector('#btnNewMember');
    const newMemberModal = document.querySelector('#modalNewMember');
    const newMemberCancelBtn = document.querySelector('#newMemberCancelBtn');
    const newMemberCreateBtn = document.querySelector('#newMemberCreateBtn');

    newMemberBtn.addEventListener('click', () => {
        newMemberModal.style.animation = 'slideUp 0.3s ease-in-out forwards';
    });

    newMemberCancelBtn.addEventListener('click', () => {
        newMemberModal.style.animation = 'slideDown 0.3s ease-in-out forwards';
    });

    newMemberCreateBtn.addEventListener('click', () => {
        const memberName = document.querySelector('#memberName').value;
        const memberRole = document.querySelector('#memberRole').value;

        if (memberName === '' || memberRole === '') {
            alert('Preencha todos os campos');
            return;
        }

        const newMemberObject = {
            nome: memberName,
            funcao: memberRole
        };

        document.querySelector('#teamGrid').innerHTML = '';
        enviarNewMember(newMemberObject);
        memberCont();
        lucide.createIcons();
    });
});
