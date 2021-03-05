(function () {
    var userInput;
    var artistOrAlbum;
    var resultsHtml = "";
    var moreResultsBtn = $(".more-button");
    var submit = $(".submit-button");
    var resultsCon = $(".results-container");
    var nextUrl;
    var timeoutHandle;
    var message = $("#message");
    var useInfiniteScroll = location.search.indexOf("scroll=infinite") > -1;

    submit.on("click", function () {
        userInput = $("input").val();
        artistOrAlbum = $("select").val();

        $.ajax({
            methode: "GET",
            url: "https://spicedify.herokuapp.com/spotify",
            data: {
                query: userInput,
                type: artistOrAlbum,
            },
            success: search,
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
            success: search,
            error: function (a, err) {
                alert("Error message " + err);
            },
        });
    });

    moreResultsBtn.on("click", function () {
        $.ajax({
            url: nextUrl,
            success: more,
        });
    });

    function getSpotify(response, attach) {
        if (!attach) {
            resultsHtml = "";
        }

        response = response.artists || response.albums;

        if (response.items.length === 0) {
            message.html(`<div class="message">Sorry, no results</div>`);
            moreResultsBtn.addClass("hidden");
        } else {
            message.html(
                `<div class="message">Here are the results for ${userInput}. Enjoy</div>`
            );
        }

        console.log("response: ", response);
        for (var i = 0; i < response.items.length; i++) {
            var image = "assets/default_img.jpg";
            if (response.items[i].images.length > 0) {
                image = response.items[i].images[0].url;
            }

            resultsHtml += `<div class="results-wrap"><div class="result"><div class="artist-name"><a href="${
                response.items[i].external_urls.spotify
            }">${response.items[i].name.slice(0, 50)}</a></div>
                    <div class="album-cover"><a href="${
                        response.items[i].external_urls.spotify
                    }"><img src="${image}"></a></div></div></div> `;
        }

        resultsCon.html(resultsHtml);

        nextUrl =
            response.next &&
            response.next.replace(
                "api.spotify.com/v1/search",
                "spicedify.herokuapp.com/spotify"
            );

        if (response.next === null) {
            return;
        } else {
            if (useInfiniteScroll) {
                checkScrollPos();
            }
        }
    }

    function search(response) {
        getSpotify(response, false);
    }

    function more(response) {
        getSpotify(response, true);
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
        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
        }
        if (hasScrolledToBottom == true) {
            $.ajax({
                url: nextUrl,
                success: more,
            });

            moreResultsBtn.css({ visibility: "hidden" });
        } else {
            timeoutHandle = setTimeout(checkScrollPos, 500);
        }
    }
})();
