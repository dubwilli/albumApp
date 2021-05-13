//link to the api used- https://www.last.fm/api

$(document).ready(function () {
    //Gets A reference to my Database
    var messageAppReference = firebase.database();
    console.log(messageAppReference);
    console.log('loaded...')
    //api key
    const api_key='8a9ee5c1dfdacc3c2fc771961bfc7245'
    //containers
    const $mainContainer = $('#main');
    const $favoritesContainer = $('#favBoard')
    //function gets the albums from the database
    $(function () {
        function getFavoriteAlbums() {
            messageAppReference.ref('favoritedAlbums').on('value', function (results) {
                const allAlbums = results.val();
                const albums = [];
                //puts the favorited albums in a list in the favorites container
                for (let alb in allAlbums) {
                    let albumFavorite = allAlbums[alb].album;
                    let $favoriteListElement = $('<li></li>');
                    $favoriteListElement.attr('data-id', alb);
                    $favoriteListElement.html(albumFavorite);
                    albums.push($favoriteListElement);
                }
                $favoritesContainer.empty();
                for (let i in albums) {
                    $favoritesContainer.append(albums[i]);
                }
            });
        };
        getFavoriteAlbums();
        //function searches the api for an album based off the query
        $('.search-button').click(function() {
            //query variable
            let query = $('.search-input').val()
            $('.search-input').val('')
            //gets the api data
            function getAlbums(){
                $.get(`https://accesscontrolalloworiginall.herokuapp.com/http://ws.audioscrobbler.com/2.0/?method=album.search&album=${query}&api_key=${api_key}&format=json`).then((response) => {
                    //console.log(response.results.albummatches.album);
                    $.each(response.results.albummatches.album, function() {
                        console.log(this);
                        let $albumData = this;
                        //formats the api data
                        let $newAlbum= $(`
                        <article class="article">
                        <section class="featuredImage">
                        <img src=${this.image[2]["#text"]} alt="" />
                        </section>
                        <section class="articleContent">
                        <h3><div class="title" id="title-id">${this.name}</div></h3>
                        <h6>${this.artist}</h6>
                        </section>
                        <section class="favorites">
                        Click to favorite
                        </section>
                        <div class="clearfix"></div>
                        </article>`);
                        $mainContainer.append($newAlbum);
                        //adds albums to the the database if you click on them
                        $($newAlbum).click(function() {
                            let $favoriteTitle = $albumData.name+" by "+$albumData.artist;
                            console.log($favoriteTitle);
                            var albumsReference = messageAppReference.ref('favoritedAlbums')
                            albumsReference.push({
                                album: $favoriteTitle,
                            });
                        })
                    })
                })
            }
        $mainContainer.empty();
        getAlbums();
    })
});
});