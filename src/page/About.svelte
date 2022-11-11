<script lang="ts">

</script>

<div id="about">
    <div id="box">
        <h1>About me</h1>
        <div id="box-text">
            <p>I already had a fascination for modern technology at an early age. Ultimately, I also found a place in
                the world of modern technology. My specialty is the front-end, but now and then I also make the
                back-end, which also gives me a lot of fun and joy. I never get bored in this world because there is
                always something new to learn, for example, a new better front-end framework.</p>
        </div>
    </div>
</div>

<style>

    #about {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100vh;
        max-height: 100vh;
        overflow: hidden;
    }

    #box {
        max-width: 800px;
    }

    p {
        font-size: 1.2em;
        font-weight: lighter;
        padding: 10px 30px;
    }

    #box-text {
        border-left: solid 5px var(--secondary-background);
    }

    @media all and (max-device-width: 480px) {
        p {
            padding: 15px;
        }

        h1 {
            text-align: center;
        }
    }


</style>