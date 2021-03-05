(function () {
    var userInput;
    var artistOrAlbum;
    var resultsHtml = "";
    var moreResultsBtn = $(".more-button");
    var submit = $(".submit-button");
    var resultsCon = $(".results-container");
    var nextUrl;
    var enjoy = "";

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

        // console.log("nextUrl: ", nextUrl);
    });

    function getSpotify(response, attach) {
        if (!attach) {
            resultsHtml = "";
        }

        response = response.artists || response.albums;

        if (response.items.length === 0) {
            resultsCon.html(`<div class="no-results">Sorry, no results</div>`);
            moreResultsBtn.addClass("hidden");
        } else {
            resultsCon.html(
                `<div class="enjoy">Here are the results for ${userInput}. Enjoy</div>`
            );
        }

        for (var i = 0; i < response.items.length; i++) {
            var image = "assets/default_img.jpg";
            // console.log("response: ", response);
            //  console.log("response.items: ", response.items);
            if (response.items[i].images.length > 0) {
                image = response.items[i].images[0].url;
            }
            enjoy = `<div class="enjoy">Here are the results for ${userInput}. Enjoy</div>`;
            resultsHtml += `<div class="results-wrap"><div class="result"><div class="artist-name"><a href="${response.items[i].external_urls.spotify}">${response.items[i].name}</a></div>
                    <div class="album-cover"><a href="${response.items[i].external_urls.spotify}"><img src="${image}"></a></div></div></div> `;

            // resultsCon.html(resultsHtml);
            resultsCon.html(enjoy + resultsHtml);
            // console.log(".next: ", response.next);

            nextUrl =
                response.next &&
                response.next.replace(
                    "api.spotify.com/v1/search",
                    "spicedify.herokuapp.com/spotify"
                );

            if (response.next === null) {
                return;
                // moreResultsBtn.css({ visibility: "hidden" });
            } else {
                // moreResultsBtn.css({ visibility: "visible" });
                checkScrollPos();
            }
        }
    }

    function search(response) {
        // console.log("response");
        getSpotify(response, false);
    }

    function more(response) {
        // console.log("response");
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
