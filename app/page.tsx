import Image from "next/image";
import api from "@/app/serices/api"; // Ensure this matches your file path from the previous step

// Define the shape of the data based on: https://api.escuelajs.co/api/v1/products
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: {
    name: string;
  };
}

export default async function Home() {
  let products: Product[] = [];
  let error = null;

  try {
    // We use the 'api' instance we created. 
    // It automatically uses the Base URL + '/products'
    const response = await api.get<Product[]>("/products");
    
    // Slice to show just first 10 for better performance in demo
    products = response.data.slice(0, 10); 
  } catch (err) {
    console.error("Failed to fetch products:", err);
    error = "Failed to load products. Please check your API connection.";
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl px-6 py-12">
        
        {/* Header Section */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Featured Products
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            fetched from <code>api.escuelajs.co</code> using Axios
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/20">
            {error}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md dark:bg-zinc-900/50 dark:border dark:border-zinc-800"
            >
              {/* Image Container */}
              <div className="relative aspect-square w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                {product.images[0] ? (
                   // Use brackets to clean up API image URLs if they contain quotes/brackets
                   <Image
                    src={product.images[0].replace(/[\[\]"]/g, "")}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-zinc-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-2">
                  <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {product.category.name}
                  </span>
                </div>
                <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {product.title}
                </h2>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-zinc-600 line-clamp-2 dark:text-zinc-400">
                  {product.description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    ${product.price}
                  </span>
                  <button className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}