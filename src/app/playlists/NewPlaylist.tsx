// 'use client'

// import { useRef, useState, useEffect } from "react";
// import { useFormState } from "react-dom";
// import { newProduct } from "@/app/lib/queries";

// import { State } from '@/lib/interface';

// export default function NewPlaylist({ id, categories }: { id: string, categories: Category[] }) {

//     const initialState = { message: null, errors: {} };
//     const newInventoryItem = newProduct.bind(null, id);
//     const [state, dispatch] = useFormState<State, FormData>(newInventoryItem, initialState);

//     function hideDefault(e: any) {
//         const select = e.target;
//         select.firstChild.style.display = 'none';
//     }

//     var heightLimit = 100;
//     function resize(e: any) {
//       const textarea = e.target;
//       textarea.style.height = ""; /* Reset the height*/
//       textarea.style.height = Math.min(textarea.scrollHeight, heightLimit) + "px";
//     }

//     const [imageUrl, setImageUrl] = useState('');
//     const imageRef = useRef<HTMLInputElement>(null);
    
//     useEffect(() => {
//         imageRef.current!.value = imageUrl;
//     }, [imageUrl]);

//     const [imageId, setImageId] = useState('');
//     const imageIdRef = useRef<HTMLInputElement>(null);

//     useEffect(() => {
//         imageIdRef.current!.value = imageId;
//     }, [imageId]);    

//     return (
//         <form action={dispatch} className="grid grid-cols-[1fr_2fr]">
//             <UploadWidget imageId={imageId} setImageId={setImageId} imageUrl={imageUrl} setImageUrl={setImageUrl} />
//             <input ref={imageIdRef} id="imageId" name="imageId" type="hidden"></input>
//             <input ref={imageRef} id="image" name="image" type="hidden"></input>
            
//             <div>
//                 <div className="block py-3 grid grid-cols-[1fr_3fr]">
//                     <label htmlFor="name" className="text-[1.2em]">Product name</label>
//                     <input id="name" name="name" autoFocus className="border border-solid border-[gray] p-2"></input>
//                 </div>
//                 <div className="block py-3 grid grid-cols-[1fr_3fr]">
//                     <label htmlFor="price" className="text-[1.2em]">Price</label>
//                     <input id="price" name="price" type="number" step='any' className="border border-solid border-[gray] p-2"></input>
//                 </div>
//                 <div className="block py-3 grid grid-cols-[1fr_3fr]">
//                     <label htmlFor="quantity" className="text-[1.2em]">Quantity</label>
//                     <input id="quantity" name="quantity" type="number" className="border border-solid border-[gray] p-2"></input>
//                 </div>
//                 <div className="block py-3 grid grid-cols-[1fr_3fr]">
//                     <label htmlFor="description" className="text-[1.2em]">Description</label>
//                     <textarea id="description" name="description" onChange={ resize } rows={1} maxLength={250} className="border border-solid border-[gray] p-2 resize-none overflow-hidden"></textarea>
//                 </div>
//                 <div className="block py-3 grid grid-cols-[1fr_3fr]">
//                     <label htmlFor="category" className="text-[1.2em]">Product Category</label>
//                     <select id="category" name="category" onChange={ hideDefault } className="border border-solid border-[gray] p-2">
//                         <option value="">-- Select Category --</option>
//                         {categories.map((cat) => (
//                           <option key={cat.id} value={cat.id}>{cat.name}</option>
//                       ))}
//                     </select>
//                 </div>

//                 <button type="submit" className="text-[1.2em] text-[white] bg-green-900 hover:bg-green-400 float-right p-2">Create Product</button>
//             </div>
//         </form>
//     )
// }