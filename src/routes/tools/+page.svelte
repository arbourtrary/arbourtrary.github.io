<script>
    import Header from "../../components/Header.svelte"
    import Tools from "../../components/Tools.svelte"
    import Footer from '../../components/Footer.svelte';
    import tools from "../../data/tools.json";
</script>

<svelte:head>
    <title>Tools</title>
    <link rel='canonical' href="https://arbourtrary.com/tools" />
    <meta name='description' content="" />        
    <meta property='og:title' content="Tools" />
    <meta property='og:site_name' content='arbourtrary' />
    <meta property='og:url' content="https://arbourtrary.com/tools" />
    <meta property='og:description' content="A handful of projects people might find useful.." />
    <meta property='og:locale' content='en_US' />
    <meta property='og:image' content="https://arbourtrary.com/images/social_music.webp" />
    
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:site' content="https://arbourtrary.com/tools" />
    <meta name='twitter:creator' content='arbourtrary' />
    <meta name='twitter:title' content="Tools" />
    <meta name='twitter:description' content="A handful of projects people might find useful." />
    <meta name='twitter:image:src' content="https://arbourtrary.com/images/social_music.webp" />
</svelte:head>


<Header/>
<Tools 
    {tools}
/>
<Footer/>