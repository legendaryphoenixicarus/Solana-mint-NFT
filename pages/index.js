import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  // Handle the submit event on form submit.
  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Send the form data to our API and get a response.
    const response = await fetch('/api/mint_new', {
      // Body of the request is the JSON data we created above.
      body: event.target.metadata.value,

      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
      // The method is POST because we are sending data.
      method: 'POST',
    });

    // Get the response data from server as JSON.
    // If server returns the success message, that means the form works.
    const result = await response.json();
    alert(`Solana NFT mint: ${result.data}`);
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Solana NFT creation</title>
        <meta name="description" content="Learn forms with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Input JSON blob for Minting NFT
        </h1>

        <p className={styles.description}>
          Fill in the input field with metadata in the type of JSON.
        </p>

        <div className={styles.grid}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="first">Metadata</label>
            <textarea id="metadata" name="metadata" rows="10" cols="50" required />
            <button type="submit">Submit</button>
          </form>
        </div>
      </main>
    </div>
  )
}
