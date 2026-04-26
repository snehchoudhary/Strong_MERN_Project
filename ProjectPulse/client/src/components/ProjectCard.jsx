function ProjectCard({ project }) {

  return (

    <div className="bg-white p-4 rounded shadow">

      <h3 className="font-bold">

        {project.name}

      </h3>

      <p className="text-gray-500">

        {project.description}

      </p>

    </div>

  );

}

export default ProjectCard;