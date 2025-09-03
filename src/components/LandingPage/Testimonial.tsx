import { useTheme } from "../../ThemeContext";
import Dot from "./Dot";
import Heading from "./Heading";

interface UserTestimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  image: string;
  rating: number;
}

export default function AppTestimonials() {
  const { isDarkMode } = useTheme();

  const testimonials: UserTestimonial[] = [
    {
      id: 1,
      name: "Ankur Sharma",
      role: "Backend Developer ",
      text: "I recently started using this app, and I explored a legitimate way to find jobs. The user interface is clean and intuitive, making it easy to navigate. I love the personalized job recommendations based on my skills and preferences.",
      image: "https://plus.unsplash.com/premium_photo-1672201106204-58e9af7a2888?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29sb3IlMjBncmFkaWVudHxlbnwwfHwwfHx8MA%3D%3D",
      rating: 5,
    },
    {
      id: 2,
      name: "Shanky",
      role: "Web Developer",
      text: "I'm a college student and was searching for internships. This app has been a game-changer for me. The job listings are diverse, and this app helped me land my first internship, but I'm giving 4 stars because the site needs some improvement.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_AOJvj0-O1jCA1beOWZmyaNMHMnoDSM_KdQ&s",
      rating: 4,
    },
    {
      id: 3,
      name: "Rishika Mathur",
      role: "SDE Intern",
      text: "Recently, I got an internship in a startup company. The app's job search feature is fantastic, allowing me to filter jobs by location, salary, and job type. I appreciate the ability to save my favorite listings for later review.",
      image: "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2020/02/Usign-Gradients-Featured-Image.jpg?w=1250&h=1120&crop=1",
      rating: 5,
    },
  ];

  return (
    <section
      className={`relative py-10 pb-28 px-4 sm:px-6 lg:px-8 ${
        isDarkMode ? "text-white" : " text-black"
      }`}
    >

      <div className="max-w-7xl flex items-center flex-col  mx-auto">

      


       <Heading heading={"Loved by 25,000+ Users"} subheading={"See what people say about our web app"}/>

        <div className="grid gap-8 items-center w-[85%] md:grid-cols-2 mt-20 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`relative flex  flex-col justify-between  rounded-xl p-6 h-[350px]  hover:shadow-2xl transition-all duration-300 border ${
                index === 1
                  ? "bg-[#ffe5c2] dark:bg-third text-black border-transparent"
                  : isDarkMode
                  ? "bg-cape-cod-800 border-gray-700"
                  : "bg-white border-gray-100"
              }`}
            >
             
              <div className="flex items-center mb-6">
                <img
                  className={`w-12 h-12 rounded-full object-cover border-2 ${
                    isDarkMode ? "border-gray-600" : "border-indigo-100"
                  }`}
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold tracking-tight">{testimonial.name}</h3>
                  <p className="text-sm tracking-tight">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div>
                   <p className="tracking-tight font-medium relative ">
               
                      {testimonial.text}
                  
                     </p>
              </div>
             
           
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}