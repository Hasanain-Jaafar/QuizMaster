import { QuizQuestion } from '@/types/quiz';

export const quizQuestions: QuizQuestion[] = [
  // Science (15 questions)
  {
    id: 1,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au"],
    correctAnswer: 2,
    explanation: "Au is the chemical symbol for gold, derived from the Latin word 'aurum'."
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter"],
    correctAnswer: 1,
    explanation: "Mars appears reddish due to iron oxide (rust) on its surface."
  },
  {
    id: 3,
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond"],
    correctAnswer: 2,
    explanation: "Diamond ranks 10 on the Mohs hardness scale, making it the hardest known natural material."
  },
  {
    id: 4,
    question: "How many bones are in the adult human body?",
    options: ["206", "300", "150"],
    correctAnswer: 0,
    explanation: "An adult human has 206 bones, while babies are born with about 300 bones that fuse together."
  },
  {
    id: 5,
    question: "What is the main gas found in the air we breathe?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen"],
    correctAnswer: 2,
    explanation: "Nitrogen makes up about 78% of Earth's atmosphere, while oxygen is about 21%."
  },
  {
    id: 6,
    question: "Which blood type is known as the universal donor?",
    options: ["A", "B", "O"],
    correctAnswer: 2,
    explanation: "Type O negative blood can be transfused to patients of any blood type."
  },
  {
    id: 7,
    question: "What is the speed of light in vacuum?",
    options: ["300,000 km/s", "150,000 km/s", "1 million km/s"],
    correctAnswer: 0,
    explanation: "The speed of light in vacuum is exactly 299,792.458 kilometers per second."
  },
  {
    id: 8,
    question: "Which organ produces insulin in the human body?",
    options: ["Liver", "Pancreas", "Kidney"],
    correctAnswer: 1,
    explanation: "The pancreas produces insulin, which regulates blood sugar levels."
  },
  {
    id: 9,
    question: "What is the smallest unit of life?",
    options: ["Atom", "Cell", "Molecule"],
    correctAnswer: 1,
    explanation: "The cell is the basic structural and functional unit of all living organisms."
  },
  {
    id: 10,
    question: "Which element has the atomic number 1?",
    options: ["Helium", "Hydrogen", "Oxygen"],
    correctAnswer: 1,
    explanation: "Hydrogen is the first element on the periodic table with atomic number 1."
  },
  {
    id: 11,
    question: "What causes tides on Earth?",
    options: ["Earth's rotation", "The Sun's gravity", "The Moon's gravity"],
    correctAnswer: 2,
    explanation: "Tides are primarily caused by the gravitational pull of the Moon on Earth's oceans."
  },
  {
    id: 12,
    question: "Which part of the brain controls balance?",
    options: ["Cerebrum", "Cerebellum", "Brainstem"],
    correctAnswer: 1,
    explanation: "The cerebellum, located at the back of the brain, controls balance and coordination."
  },
  {
    id: 13,
    question: "What is the pH of pure water?",
    options: ["5", "7", "9"],
    correctAnswer: 1,
    explanation: "Pure water has a neutral pH of 7 at 25°C (77°F)."
  },
  {
    id: 14,
    question: "Which planet has the most moons?",
    options: ["Jupiter", "Saturn", "Uranus"],
    correctAnswer: 0,
    explanation: "Jupiter has 95 confirmed moons, making it the planet with the most moons in our solar system."
  },
  {
    id: 15,
    question: "What is the largest organ in the human body?",
    options: ["Liver", "Heart", "Skin"],
    correctAnswer: 2,
    explanation: "The skin is the largest organ, covering about 20 square feet in adults."
  },
  // Geography (10 questions)
  {
    id: 16,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean"],
    correctAnswer: 2,
    explanation: "The Pacific Ocean covers about 63 million square miles, more than all land combined."
  },
  {
    id: 17,
    question: "Which country has the most natural lakes?",
    options: ["Russia", "Canada", "USA"],
    correctAnswer: 1,
    explanation: "Canada has over 2 million lakes, more than any other country."
  },
  {
    id: 18,
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra"],
    correctAnswer: 2,
    explanation: "Canberra was specifically built as the capital of Australia, chosen as a compromise between Sydney and Melbourne."
  },
  {
    id: 19,
    question: "Which desert is the largest in the world?",
    options: ["Sahara", "Arabian", "Antarctic"],
    correctAnswer: 2,
    explanation: "Antarctica is considered a desert with an area of 14 million km², making it the world's largest desert."
  },
  {
    id: 20,
    question: "What is the longest river in the world?",
    options: ["Amazon", "Nile", "Yangtze"],
    correctAnswer: 1,
    explanation: "The Nile River in Africa is approximately 6,650 km (4,130 miles) long."
  },
  {
    id: 21,
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["China", "Japan", "South Korea"],
    correctAnswer: 1,
    explanation: "Japan is called the 'Land of the Rising Sun' because from China, the sun appears to rise from Japan."
  },
  {
    id: 22,
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Vatican City", "San Marino"],
    correctAnswer: 1,
    explanation: "Vatican City is only 0.17 square miles (0.44 km²), making it the smallest internationally recognized independent state."
  },
  {
    id: 23,
    question: "Which mountain is the highest in the world?",
    options: ["K2", "Mount Everest", "Kangchenjunga"],
    correctAnswer: 1,
    explanation: "Mount Everest stands at 8,848.86 meters (29,031.7 feet) above sea level."
  },
  {
    id: 24,
    question: "What is the most populated country in the world?",
    options: ["India", "China", "USA"],
    correctAnswer: 1,
    explanation: "China has a population of over 1.4 billion people, though India is rapidly catching up."
  },
  {
    id: 25,
    question: "Which European country has the most islands?",
    options: ["Greece", "Sweden", "Norway"],
    correctAnswer: 1,
    explanation: "Sweden has approximately 267,570 islands, though only about 1,000 are inhabited."
  },

  // History (10 questions)
  {
    id: 26,
    question: "Who was the first president of the United States?",
    options: ["Thomas Jefferson", "George Washington", "John Adams"],
    correctAnswer: 1,
    explanation: "George Washington served as president from 1789 to 1797."
  },
  {
    id: 27,
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946"],
    correctAnswer: 1,
    explanation: "World War II ended in 1945 with the surrender of Germany in May and Japan in September."
  },
  {
    id: 28,
    question: "Who discovered penicillin?",
    options: ["Alexander Fleming", "Marie Curie", "Louis Pasteur"],
    correctAnswer: 0,
    explanation: "Alexander Fleming discovered penicillin in 1928, revolutionizing medicine."
  },
  {
    id: 29,
    question: "Which ancient civilization built the pyramids?",
    options: ["Romans", "Egyptians", "Greeks"],
    correctAnswer: 1,
    explanation: "The ancient Egyptians built the pyramids as tombs for their pharaohs."
  },
  {
    id: 30,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 1,
    explanation: "Leonardo da Vinci painted the Mona Lisa between 1503 and 1519."
  },
  {
    id: 31,
    question: "What year did the Titanic sink?",
    options: ["1910", "1912", "1914"],
    correctAnswer: 1,
    explanation: "The Titanic sank on April 15, 1912, after hitting an iceberg."
  },
  {
    id: 32,
    question: "Who was the first man to walk on the moon?",
    options: ["Buzz Aldrin", "Neil Armstrong", "Michael Collins"],
    correctAnswer: 1,
    explanation: "Neil Armstrong took his historic first steps on July 20, 1969."
  },
  {
    id: 33,
    question: "Which empire was ruled by Julius Caesar?",
    options: ["Greek", "Roman", "Ottoman"],
    correctAnswer: 1,
    explanation: "Julius Caesar was a Roman general and statesman who played a critical role in the demise of the Roman Republic."
  },
  {
    id: 34,
    question: "When did the French Revolution begin?",
    options: ["1776", "1789", "1799"],
    correctAnswer: 1,
    explanation: "The French Revolution began in 1789 with the storming of the Bastille."
  },
  {
    id: 35,
    question: "Who wrote the Declaration of Independence?",
    options: ["George Washington", "Benjamin Franklin", "Thomas Jefferson"],
    correctAnswer: 2,
    explanation: "Thomas Jefferson was the principal author of the Declaration of Independence in 1776."
  },
  // Technology (10 questions)
  {
    id: 36,
    question: "Which company created the iPhone?",
    options: ["Microsoft", "Apple", "Google"],
    correctAnswer: 1,
    explanation: "Apple introduced the first iPhone in 2007, revolutionizing the smartphone industry."
  },
  {
    id: 37,
    question: "What does 'HTTP' stand for?",
    options: ["HyperText Transfer Protocol", "High Tech Transfer Process", "Hyper Transfer Text Protocol"],
    correctAnswer: 0,
    explanation: "HTTP stands for HyperText Transfer Protocol, the foundation of data communication on the World Wide Web."
  },
  {
    id: 38,
    question: "Which programming language is known as the language of the web?",
    options: ["Python", "JavaScript", "Java"],
    correctAnswer: 1,
    explanation: "JavaScript is the primary language for web development and runs in all modern browsers."
  },
  {
    id: 39,
    question: "What year was Facebook founded?",
    options: ["2002", "2004", "2006"],
    correctAnswer: 1,
    explanation: "Facebook was founded by Mark Zuckerberg in February 2004."
  },
  {
    id: 40,
    question: "What does 'CPU' stand for?",
    options: ["Central Processing Unit", "Computer Processing Unit", "Central Program Unit"],
    correctAnswer: 0,
    explanation: "CPU stands for Central Processing Unit, the primary component of a computer that performs most processing."
  },
  {
    id: 41,
    question: "Which company developed the Windows operating system?",
    options: ["Apple", "Microsoft", "IBM"],
    correctAnswer: 1,
    explanation: "Microsoft Corporation developed and released Windows 1.0 in 1985."
  },
  {
    id: 42,
    question: "What does 'AI' stand for in technology?",
    options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Interface"],
    correctAnswer: 1,
    explanation: "AI stands for Artificial Intelligence, the simulation of human intelligence in machines."
  },
  {
    id: 43,
    question: "Which social media platform is limited to 280 characters per post?",
    options: ["Facebook", "Twitter", "Instagram"],
    correctAnswer: 1,
    explanation: "Twitter (now X) originally limited posts to 140 characters, later expanded to 280 characters."
  },
  {
    id: 44,
    question: "What does 'URL' stand for?",
    options: ["Universal Resource Locator", "Uniform Resource Locator", "Universal Reference Link"],
    correctAnswer: 1,
    explanation: "URL stands for Uniform Resource Locator, the address of a specific webpage or file on the Internet."
  },
  {
    id: 45,
    question: "Which company owns the Android operating system?",
    options: ["Microsoft", "Apple", "Google"],
    correctAnswer: 2,
    explanation: "Google owns Android, which it acquired in 2005 and released to the public in 2008."
  },
  // Entertainment (15 questions)
  {
    id: 46,
    question: "Who directed the movie 'Titanic'?",
    options: ["Steven Spielberg", "James Cameron", "Christopher Nolan"],
    correctAnswer: 1,
    explanation: "James Cameron directed and wrote Titanic, which won 11 Academy Awards."
  },
  {
    id: 47,
    question: "Which band released the album 'Abbey Road'?",
    options: ["The Rolling Stones", "The Beatles", "Queen"],
    correctAnswer: 1,
    explanation: "The Beatles released Abbey Road in 1969, their final studio album recorded together."
  },
  {
    id: 48,
    question: "Who played Iron Man in the Marvel Cinematic Universe?",
    options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth"],
    correctAnswer: 1,
    explanation: "Robert Downey Jr. portrayed Tony Stark/Iron Man in the Marvel Cinematic Universe."
  },
  {
    id: 49,
    question: "Which TV show features the characters Ross, Rachel, and Chandler?",
    options: ["How I Met Your Mother", "The Office", "Friends"],
    correctAnswer: 2,
    explanation: "Friends, which aired from 1994 to 2004, featured these iconic characters."
  },
  {
    id: 50,
    question: "Who wrote the Harry Potter book series?",
    options: ["J.R.R. Tolkien", "J.K. Rowling", "Stephen King"],
    correctAnswer: 1,
    explanation: "J.K. Rowling wrote the seven-book Harry Potter series, which has sold over 500 million copies worldwide."
  },
  {
    id: 51,
    question: "Which singer is known as the 'Queen of Pop'?",
    options: ["Beyoncé", "Madonna", "Taylor Swift"],
    correctAnswer: 1,
    explanation: "Madonna is often referred to as the 'Queen of Pop' for her influence on popular music and culture."
  },
  {
    id: 52,
    question: "Which movie won the first Academy Award for Best Picture?",
    options: ["Gone with the Wind", "Wings", "Casablanca"],
    correctAnswer: 1,
    explanation: "Wings won the first Academy Award for Best Picture at the 1st Academy Awards in 1929."
  },
  {
    id: 53,
    question: "Who created the cartoon characters Tom and Jerry?",
    options: ["Walt Disney", "William Hanna and Joseph Barbera", "Warner Bros."],
    correctAnswer: 1,
    explanation: "Tom and Jerry were created by William Hanna and Joseph Barbera and first appeared in 1940."
  },
  {
    id: 54,
    question: "Which video game features the character Mario?",
    options: ["Sonic the Hedgehog", "Super Mario Bros.", "The Legend of Zelda"],
    correctAnswer: 1,
    explanation: "Mario first appeared in Donkey Kong (1981) and became the protagonist of Super Mario Bros. in 1985."
  },
  {
    id: 55,
    question: "Which actor played Jack Dawson in Titanic?",
    options: ["Brad Pitt", "Leonardo DiCaprio", "Tom Cruise"],
    correctAnswer: 1,
    explanation: "Leonardo DiCaprio played Jack Dawson opposite Kate Winslet's Rose in Titanic."
  },
  {
    id: 56,
    question: "What is the highest-grossing film of all time?",
    options: ["Avatar", "Avengers: Endgame", "Titanic"],
    correctAnswer: 0,
    explanation: "Avatar (2009) is the highest-grossing film of all time with over $2.9 billion in worldwide box office."
  },
  {
    id: 57,
    question: "Which musical instrument has 88 keys?",
    options: ["Guitar", "Piano", "Organ"],
    correctAnswer: 1,
    explanation: "A standard piano has 88 keys: 52 white and 36 black."
  },
  {
    id: 58,
    question: "Who painted 'The Starry Night'?",
    options: ["Pablo Picasso", "Vincent van Gogh", "Claude Monet"],
    correctAnswer: 1,
    explanation: "Vincent van Gogh painted 'The Starry Night' in 1889 while in an asylum in Saint-Rémy."
  },
  {
    id: 59,
    question: "Which streaming service created 'Stranger Things'?",
    options: ["Hulu", "Netflix", "Amazon Prime"],
    correctAnswer: 1,
    explanation: "Netflix created and released Stranger Things in 2016, which became a global phenomenon."
  },
  {
    id: 60,
    question: "Who is known as the 'King of Pop'?",
    options: ["Elvis Presley", "Michael Jackson", "Prince"],
    correctAnswer: 1,
    explanation: "Michael Jackson earned the title 'King of Pop' for his revolutionary contributions to music and dance."
  },
  // Sports (10 questions)
  {
    id: 61,
    question: "How many players are on a soccer team?",
    options: ["9", "10", "11"],
    correctAnswer: 2,
    explanation: "A standard soccer team has 11 players on the field, including the goalkeeper."
  },
  {
    id: 62,
    question: "Which country has won the most FIFA World Cups?",
    options: ["Germany", "Brazil", "Italy"],
    correctAnswer: 1,
    explanation: "Brazil has won the FIFA World Cup 5 times (1958, 1962, 1970, 1994, 2002)."
  },
  {
    id: 63,
    question: "In which sport would you perform a slam dunk?",
    options: ["Tennis", "Basketball", "Volleyball"],
    correctAnswer: 1,
    explanation: "A slam dunk is a basketball move where a player jumps and powerfully throws the ball downward through the basket."
  },
  {
    id: 64,
    question: "What is the diameter of a basketball hoop?",
    options: ["16 inches", "18 inches", "20 inches"],
    correctAnswer: 1,
    explanation: "A regulation basketball hoop has an inner diameter of 18 inches (45.7 cm)."
  },
  {
    id: 65,
    question: "Which city hosted the 2020 Summer Olympics?",
    options: ["Tokyo", "Beijing", "London"],
    correctAnswer: 0,
    explanation: "Tokyo hosted the 2020 Summer Olympics, which were postponed to 2021 due to the COVID-19 pandemic."
  },
  {
    id: 66,
    question: "How many rings are on the Olympic flag?",
    options: ["4", "5", "6"],
    correctAnswer: 1,
    explanation: "The Olympic flag has five interlocking rings representing the five continents."
  },
  {
    id: 67,
    question: "Which tennis player has won the most Grand Slam titles?",
    options: ["Roger Federer", "Rafael Nadal", "Novak Djokovic"],
    correctAnswer: 2,
    explanation: "Novak Djokovic holds the record for the most Grand Slam singles titles in men's tennis."
  },
  {
    id: 68,
    question: "What is the length of a marathon?",
    options: ["26.2 miles", "13.1 miles", "31 miles"],
    correctAnswer: 0,
    explanation: "A marathon is 26.2 miles (42.195 kilometers) long."
  },
  {
    id: 69,
    question: "Which country invented baseball?",
    options: ["United States", "United Kingdom", "Canada"],
    correctAnswer: 0,
    explanation: "Baseball evolved from older bat-and-ball games and was developed in the United States in the mid-19th century."
  },
  {
    id: 70,
    question: "How many points is a touchdown worth in American football?",
    options: ["6", "7", "8"],
    correctAnswer: 0,
    explanation: "A touchdown is worth 6 points, with an opportunity for an extra point or two-point conversion."
  },
  // Food & Drink (10 questions)
  {
    id: 71,
    question: "Which country is known for inventing pizza?",
    options: ["United States", "France", "Italy"],
    correctAnswer: 2,
    explanation: "Pizza originated in Naples, Italy, in the 18th century as a simple, affordable food for the poor."
  },
  {
    id: 72,
    question: "What is the main ingredient in guacamole?",
    options: ["Tomato", "Avocado", "Onion"],
    correctAnswer: 1,
    explanation: "Guacamole is primarily made from mashed avocados, often mixed with lime juice, salt, and other ingredients."
  },
  {
    id: 73,
    question: "Which fruit is known as the 'king of fruits'?",
    options: ["Mango", "Durian", "Pineapple"],
    correctAnswer: 1,
    explanation: "Durian is called the 'king of fruits' in Southeast Asia, known for its strong odor and rich taste."
  },
  {
    id: 74,
    question: "What type of alcohol is tequila made from?",
    options: ["Grapes", "Blue agave", "Barley"],
    correctAnswer: 1,
    explanation: "Tequila is made from the blue agave plant, primarily in the area surrounding the city of Tequila, Mexico."
  },
  {
    id: 75,
    question: "Which country produces the most coffee?",
    options: ["Colombia", "Brazil", "Vietnam"],
    correctAnswer: 1,
    explanation: "Brazil is the world's largest coffee producer, accounting for about one-third of global production."
  },
  {
    id: 76,
    question: "What is the primary ingredient in sushi rice?",
    options: ["Brown rice", "Jasmine rice", "Short-grain rice"],
    correctAnswer: 2,
    explanation: "Sushi is made with short-grain Japanese rice mixed with vinegar, sugar, and salt."
  },
  {
    id: 77,
    question: "Which nut is used to make marzipan?",
    options: ["Almond", "Cashew", "Hazelnut"],
    correctAnswer: 0,
    explanation: "Marzipan is made from ground almonds, sugar, and sometimes egg whites."
  },
  {
    id: 78,
    question: "What is the main ingredient in hummus?",
    options: ["Lentils", "Chickpeas", "White beans"],
    correctAnswer: 1,
    explanation: "Hummus is a Middle Eastern dip made primarily from cooked, mashed chickpeas blended with tahini, olive oil, lemon juice, and garlic."
  },
  {
    id: 79,
    question: "Which country is the largest producer of chocolate?",
    options: ["Switzerland", "United States", "Ivory Coast"],
    correctAnswer: 2,
    explanation: "The Ivory Coast (Côte d'Ivoire) produces about 40% of the world's cocoa beans."
  },
  {
    id: 80,
    question: "What is the most consumed beverage in the world after water?",
    options: ["Coffee", "Tea", "Beer"],
    correctAnswer: 1,
    explanation: "Tea is the second most consumed beverage globally after water, with over 2 billion cups consumed daily."
  },
  // General Knowledge (15 questions)
  {
    id: 81,
    question: "How many continents are there?",
    options: ["5", "6", "7"],
    correctAnswer: 2,
    explanation: "There are 7 continents: Africa, Antarctica, Asia, Australia, Europe, North America, and South America."
  },
  {
    id: 82,
    question: "What is the currency of Japan?",
    options: ["Won", "Yen", "Yuan"],
    correctAnswer: 1,
    explanation: "The Japanese yen is the official currency of Japan, with symbol ¥ and code JPY."
  },
  {
    id: 83,
    question: "Which animal is known as the 'ship of the desert'?",
    options: ["Horse", "Camel", "Elephant"],
    correctAnswer: 1,
    explanation: "Camels are called 'ships of the desert' because they can carry heavy loads across long distances in arid environments."
  },
  {
    id: 84,
    question: "How many days are in a leap year?",
    options: ["365", "366", "364"],
    correctAnswer: 1,
    explanation: "A leap year has 366 days, with February having 29 days instead of 28."
  },
  {
    id: 85,
    question: "What is the capital of Canada?",
    options: ["Toronto", "Vancouver", "Ottawa"],
    correctAnswer: 2,
    explanation: "Ottawa is the capital city of Canada, located in the province of Ontario."
  },
  {
    id: 86,
    question: "Which is the largest mammal?",
    options: ["African Elephant", "Blue Whale", "Giraffe"],
    correctAnswer: 1,
    explanation: "The blue whale is the largest animal ever known to have existed, reaching up to 100 feet in length."
  },
  {
    id: 87,
    question: "How many colors are in a rainbow?",
    options: ["5", "6", "7"],
    correctAnswer: 2,
    explanation: "A rainbow has 7 colors: red, orange, yellow, green, blue, indigo, and violet (ROYGBIV)."
  },
  {
    id: 88,
    question: "What is the tallest animal in the world?",
    options: ["Elephant", "Giraffe", "Ostrich"],
    correctAnswer: 1,
    explanation: "Giraffes are the tallest land animals, with males reaching up to 18 feet (5.5 meters) in height."
  },
  {
    id: 89,
    question: "Which planet is closest to the Sun?",
    options: ["Venus", "Mercury", "Mars"],
    correctAnswer: 1,
    explanation: "Mercury is the closest planet to the Sun, orbiting at an average distance of about 36 million miles (58 million km)."
  },
  {
    id: 90,
    question: "How many sides does a hexagon have?",
    options: ["5", "6", "7"],
    correctAnswer: 1,
    explanation: "A hexagon is a polygon with six sides and six angles."
  },
  {
    id: 91,
    question: "What is the chemical formula for table salt?",
    options: ["NaCl", "H2O", "CO2"],
    correctAnswer: 0,
    explanation: "Table salt is sodium chloride, with the chemical formula NaCl."
  },
  {
    id: 92,
    question: "Which bird is known for its ability to mimic human speech?",
    options: ["Crow", "Parrot", "Eagle"],
    correctAnswer: 1,
    explanation: "Parrots, especially African grey parrots, are famous for their ability to mimic human speech and other sounds."
  },
  {
    id: 93,
    question: "What is the fastest land animal?",
    options: ["Lion", "Cheetah", "Pronghorn Antelope"],
    correctAnswer: 1,
    explanation: "The cheetah can reach speeds of up to 70 mph (113 km/h) in short bursts."
  },
  {
    id: 94,
    question: "Which language has the most native speakers?",
    options: ["English", "Mandarin Chinese", "Spanish"],
    correctAnswer: 1,
    explanation: "Mandarin Chinese has over 1 billion native speakers, making it the most spoken first language in the world."
  },
  {
    id: 95,
    question: "How many time zones are there in the world?",
    options: ["12", "24", "48"],
    correctAnswer: 1,
    explanation: "There are 24 time zones, each generally 15 degrees of longitude apart."
  },
  {
    id: 96,
    question: "What is the most common element in the Earth's atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide"],
    correctAnswer: 1,
    explanation: "Nitrogen makes up about 78% of Earth's atmosphere by volume."
  },
  {
    id: 97,
    question: "Which fruit is associated with Isaac Newton's discovery of gravity?",
    options: ["Orange", "Apple", "Pear"],
    correctAnswer: 1,
    explanation: "The story goes that Newton was inspired by seeing an apple fall from a tree, leading to his theories about gravity."
  },
  {
    id: 98,
    question: "How many bones are in a shark's body?",
    options: ["0", "100", "200"],
    correctAnswer: 0,
    explanation: "Sharks do not have bones; their skeletons are made of cartilage, which is lighter and more flexible than bone."
  },
  {
    id: 99,
    question: "Which organ is responsible for pumping blood throughout the body?",
    options: ["Lungs", "Heart", "Liver"],
    correctAnswer: 1,
    explanation: "The heart pumps blood through the circulatory system, delivering oxygen and nutrients to tissues."
  },
  {
    id: 100,
    question: "What is the square root of 144?",
    options: ["10", "12", "14"],
    correctAnswer: 1,
    explanation: "12 × 12 = 144, so the square root of 144 is 12."
  }
];