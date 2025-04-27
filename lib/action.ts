// app/actions/chat.ts
'use server'

export async function handleClickChat() {
    console.log('Server-side action triggered')

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos/1', {
            method: 'GET', // GET request
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json() // Parse JSON response
        console.log('Fetched Data:', data)  // Log the fetched data

        return data // Return data to the client-side
    } catch (error) {
        console.error('Error fetching data:', error)
        return { error: 'Failed to fetch data' }
    }
}
