<script>
    import Header from "../../../components/Header.svelte";
    import Footer from "../../../components/Footer.svelte";
    import KoikeImageTool from "../../../components/KoikeImageTool.svelte";
</script>

<svelte:head>
    <title>Dot Sampler</title>
    <link rel='canonical' href="https://arbourtrary.com/tools/dot-sampler" />
    <meta name='description' content="Upload an image and rearrange it as circular dot samples, inspired by Kensuke Koike." />
    <meta property='og:title' content="Dot Sampler" />
    <meta property='og:site_name' content='arbourtrary' />
    <meta property='og:url' content="https://arbourtrary.com/tools/dot-sampler" />
    <meta property='og:description' content="Upload an image and rearrange it as circular dot samples, inspired by Kensuke Koike." />
    <meta property='og:locale' content='en_US' />
    <meta property='og:image' content="https://arbourtrary.com/images/social_music.webp" />
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:site' content="https://arbourtrary.com/tools/dot-sampler" />
    <meta name='twitter:creator' content='arbourtrary' />
    <meta name='twitter:title' content="Dot Sampler" />
    <meta name='twitter:description' content="Upload an image and rearrange it as circular dot samples, inspired by Kensuke Koike." />
    <meta name='twitter:image:src' content="https://arbourtrary.com/images/social_music.webp" />
</svelte:head>

<Header/>
<KoikeImageTool/>
<Footer/>
