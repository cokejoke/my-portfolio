<script lang="ts">
    import 'atropos/css';
    import '@splidejs/svelte-splide/css';

    import Sidebar from "./components/Sidebar.svelte";
    import Home from "./page/Home.svelte";
    import About from "./page/About.svelte";
    import Projects from "./page/Projects.svelte";
    import {Splide, SplideSlide} from "@splidejs/svelte-splide";
    import Contact from "./page/Contact.svelte";

    let splide: Splide;
    let index: number = 0;

</script>

<Sidebar bind:splide={splide} bind:index={index}>
    <main>
        <Splide on:active={(slide) => {index = slide.detail.Slide.index}} bind:this={splide} options={ {
            start: 0,
            wheel: true,
            pagination: false,
            arrows: false,
            height: "100vh",
            width: "100%",
            direction: "ttb",
        } }>

            <SplideSlide>
                <Home bind:splide={splide}/>
            </SplideSlide>

            <SplideSlide>
                <About/>
            </SplideSlide>

            <SplideSlide>
                <Projects/>
            </SplideSlide>

            <SplideSlide>
                <Contact/>
            </SplideSlide>

        </Splide>
    </main>
</Sidebar>

<style>
    main {
        padding: 0 50px;
    }

    @media all and (max-device-width: 480px) {
        main {
            padding: 0 15px;
        }
    }

    @media all and (max-device-width: 300px) {
        main {
            padding: 0;
        }
    }
</style>