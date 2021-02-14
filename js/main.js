function fetchData(size, step) {
    $('.loader').show()

    fetch("https://betwill.com/api/game/getgametemplates/1/1/1")
    .then(response => {
        if(!response.ok) {
            throw error("ERROR")
        }
        return response.json();
    })
    .then(data => {
        const sliceFrom = (size*step)-size
        var gamesLength = data.GameTemplates.length

        if(gamesLength < size*step) $('.load-more').remove();

        $('.top-filter ul li span').html(`( ${gamesLength} )`)

        var GameTemplates = data.GameTemplates.sort((a, b) => {
            return (a.DefaultOrdering > b.DefaultOrdering) ? 1 : -1
        }).slice(sliceFrom, size*step)

        var GameTemplateImages = data.GameTemplateImages
        var GameTemplateNames = data.GameTemplateNameTranslations

        let languageId = GameTemplateNames.filter(function (e) {
            return e.LanguageId == 1;
        });

        const result = GameTemplates.map(games => {
            const name = languageId.find(u => u.GameTemplateId === games.ID) || {};
            const photo = GameTemplateImages.find(s => s.GameTemplateId === name.GameTemplateId) || {};
            return { ...name, ...photo };
        });

        console.log(result);

        result.map(i => {

            $('.games-container ul').append(`
                <li category="">
                    <div class="fav"><img src="../images/fav.png"  alt=""></div>
                    <img src="https://static.inpcdn.com/${i.CdnUrl}"  alt="">
                    <h1 languageid=${i.LanguageId}>${i.Value}</h1>
                </li>
            `)

            $('.loader').hide()
            $('.load-more').addClass('active')
        })


        $("#search").on('keyup', function(e){
                
            $('.games-container ul').html('')
        
            var value = $('#search').val();
            var expression = new RegExp(value, "i")
        
            result.map(i => {
        
                if(i.Value.search(expression) != -1) {

                    $('.games-container ul').append(`
                        <li>
                            <div class="fav"><img src="../images/fav.png"  alt=""></div>
                            <img src="https://static.inpcdn.com/${i.CdnUrl}"  alt="">
                            <h1 languageid=${i.LanguageId}>${i.Value}</h1>
                        </li>
                    `)
                }
        
            })
        
        });


        $('.fav').click(function(e) {
            e.preventDefault();

            $(".counter").addClass('active')

            $(this).parent('li').attr("category", 'fav');
        })

        $('li[categoryType="fav"]').click(function(e) {
            e.preventDefault();

            $('.games-container ul li:not([category="fav"])').hide()
        })

    })
}

let dataMax = 60
let step = 1
fetchData(dataMax,step);

$('.load-more').on('click', function(e){
    e.preventDefault();
    step++
    fetchData(dataMax, step)
})


var swiper = new Swiper('.swiper-container', {
    slidesPerView: 2,
    spaceBetween: 50,
    loop: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        1024: {
            slidesPerView: 2,
            spaceBetween: 25,
        },
    }
});