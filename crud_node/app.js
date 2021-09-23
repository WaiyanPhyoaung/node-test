const express = require("Express");
const Joi = require("joi");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const courses = [
  { id: 1, name: "Javascript" },
  { id: 2, name: "NodeJs" },
  { id: 3, name: "ExpressJs" },
];

app.get("/", (request, response) => {
  response.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((course) => course.id === Number(req.params.id));

  course
    ? res.send(course)
    : res.status(404).send("There is no course with such id!");
});

app.post("/api/courses", (req, res) => {
  const result = validateCourse(req.body);

  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const new_course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(new_course);
  res.send(new_course);
});

app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course) return res.status(404).send("No course with such Id !");

  const result = validateCourse(req.body);

  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  course.name = req.body.name;
  console.log(courses);
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("No course with such Id !");

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().required().min(3),
  });

  return schema.validate(course);
}

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
