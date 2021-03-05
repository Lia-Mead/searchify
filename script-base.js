(function () {
    var userInput;
    var artistOrAlbum;
    var resultsHtml = "";
    var moreResultsBtn = $(".more-button");
    var submit = $(".submit-button");
    var resultsCon = $(".results-container");
    var nextUrl;

    var useInfiniteScroll = location.search.indexOf("scroll=infinite") > -1;

    submit.on("click", function () {
        // console.log("userInput", userInput, "----", artistOrAlbum);
        userInput = $("input").val();
        artistOrAlbum = $("select").val();
        resultsHtml = "";

        $.ajax({
            methode: "GET",
            url: "https://spicedify.herokuapp.com/spotify",
            data: {
                query: userInput,
                type: artistOrAlbum,
            },
            success: getSpotify,
        });
    });

    $("#form").on("submit", function (e) {
        e.preventDefault();

        userInput = $("input").val();
        artistOrAlbum = $("select").val();

        // console.log("pressed enter");
        $.ajax({
            url: "https://spicedify.herokuapp.com/spotify",
            data: {
                query: userInput,
                type: artistOrAlbum,
            },
            success: getSpotify,
            error: function (a, err) {
                alert("Error message " + err);
            },
        });
    });

    // moreResultsBtn.on("click", function () {
    //     $.ajax({
    //         url: nextUrl,
    //         success: getSpotify,
    //     });
    // });

    function getSpotify(response) {
        response = response.artists || response.albums;
        // console.log("response: ", response);

        if (response.items.length === 0) {
            // console.log("no results");
            resultsCon.html(`<div class="no-results">Sorry, no results</div>`);
            moreResultsBtn.addClass("hidden");
        } else {
            for (var i = 0; i < response.items.length; i++) {
                var image = "assets/default_img.jpg";
                // console.log("response: ", response);
                //  console.log("response.items: ", response.items);
                if (response.items[i].images.length > 0) {
                    image = response.items[i].images[0].url;
                }
                resultsHtml += `<div class="results-wrap"><div class="result"><div class="artist-name"><a href="${response.items[i].external_urls.spotify}">${response.items[i].name}</a></div>
                <div class="album-cover"><a href="${response.items[i].external_urls.spotify}"><img src="${image}"></a></div></div></div> `;

                // $(".artist-name").slice(0, 5);
                // $(".artist-name").text(function (index, text) {
                //     return text.substring(0, 5);
                // });

                resultsCon.html(resultsHtml);
                // console.log(".next: ", response.next);

                nextUrl =
                    response.next &&
                    response.next.replace(
                        "api.spotify.com/v1/search",
                        "spicedify.herokuapp.com/spotify"
                    );

                if (response.next === null) {
                    // console.log("no more");
                    moreResultsBtn.css({ visibility: "hidden" });
                } else {
                    if (useInfiniteScroll) {
                        checkScrollPos();
                    }

                    // moreResultsBtn.css({ visibility: "visible" });
                }
            }
        }
    }

    $(window).scroll(function () {
        var showAfter = 100;
        $(".back-to-top").css({
            visibility: "visible",
        });
        if ($(this).scrollTop() > showAfter) {
            $(".back-to-top").fadeIn();
        } else {
            $(".back-to-top").fadeOut();
        }
    });

    $(".back-to-top").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 800);
        return false;
    });

    function checkScrollPos() {
        var hasScrolledToBottom =
            $(document).height() - 100 <=
            $(window).height() + $(document).scrollTop();
        if (hasScrolledToBottom == true) {
            $.ajax({
                url: nextUrl,
                success: getSpotify,
            });
            moreResultsBtn.css({ visibility: "hidden" });
        } else {
            setTimeout(checkScrollPos, 500);
        }
    }
})();
