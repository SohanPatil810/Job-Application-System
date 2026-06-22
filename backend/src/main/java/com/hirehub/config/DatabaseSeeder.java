package com.hirehub.config;

import com.hirehub.models.Job;
import com.hirehub.models.User;
import com.hirehub.repositories.JobRepository;
import com.hirehub.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, JobRepository jobRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (jobRepository.count() > 20) {
            System.out.println("Database already seeded with jobs. Skipping...");
            return;
        }

        System.out.println("Seeding database with 70 dummy jobs...");

        // 1. Create Recruiter Companies
        String[] companyNames = {"Google", "Amazon", "Microsoft", "Netflix", "Apple", "Tesla", "Stripe", "Spotify", "Airbnb", "Meta"};
        List<User> recruiters = new ArrayList<>();

        for (String company : companyNames) {
            String email = company.toLowerCase() + "@hirehub.com";
            User recruiter = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setName(company);
                newUser.setEmail(email);
                newUser.setPassword(passwordEncoder.encode("password123"));
                newUser.setRole(com.hirehub.models.Role.ROLE_RECRUITER);
                return userRepository.save(newUser);
            });
            recruiters.add(recruiter);
        }

        // 2. Job Generation Data arrays
        String[] titles = {
                "Senior React Developer", "Backend Java Engineer", "Product Designer", "Data Scientist",
                "Machine Learning Engineer", "DevOps Specialist", "Marketing Manager", "Sales Executive",
                "Customer Success Manager", "Technical Writer", "Full Stack Developer", "iOS Engineer",
                "Android Engineer", "Cybersecurity Analyst", "Cloud Architect"
        };
        String[] categories = {"Engineering", "Design", "Marketing", "Sales", "Product", "Customer Support", "Data"};
        String[] locations = {"San Francisco, CA", "New York, NY", "Austin, TX", "London, UK", "Remote", "Seattle, WA", "Berlin, Germany", "Toronto, Canada", "Sydney, Australia"};
        String[] salaries = {"$80k - $100k", "$100k - $130k", "$130k - $160k", "$160k - $200k", "$200k+", "Not Disclosed"};
        String[] experiences = {"Entry Level", "1-3 Years", "3-5 Years", "5-8 Years", "10+ Years"};
        String[] skillsList = {"React, Node.js", "Java, Spring Boot", "Figma, Adobe XD", "Python, SQL", "AWS, Docker, CI/CD", "SEO, Content Strategy", "Salesforce, CRM", "Communication, Leadership", "Swift, Objective-C", "Kotlin, Android Studio"};

        String[] descTemplates = {
                "We are looking for a highly skilled individual to join our innovative team. You will be responsible for developing scalable solutions and collaborating with cross-functional teams to deliver high-quality products. We offer great benefits, flexible working hours, and a collaborative environment.",
                "Join our fast-growing startup! We need someone passionate about their craft who loves solving complex problems. You will take ownership of major features and drive them from conception to deployment. Competitive salary and equity package included.",
                "Are you ready to make a global impact? We are hiring! Your day-to-day will involve working with cutting-edge technologies, mentoring junior team members, and designing robust architectures. We value diversity and continuous learning.",
                "Exciting opportunity alert! We are searching for an experienced professional to lead key initiatives within our organization. You'll work directly with stakeholders to ensure our products meet the highest standards. Excellent remote-first culture."
        };

        Random random = new Random();
        List<Job> jobsToSave = new ArrayList<>();

        for (int i = 0; i < 70; i++) {
            Job job = new Job();
            job.setTitle(titles[random.nextInt(titles.length)]);
            job.setCategory(categories[random.nextInt(categories.length)]);
            job.setLocation(locations[random.nextInt(locations.length)]);
            job.setSalary(salaries[random.nextInt(salaries.length)]);
            job.setExperience(experiences[random.nextInt(experiences.length)]);
            job.setSkills(skillsList[random.nextInt(skillsList.length)]);
            
            // Build a longer description
            String desc = descTemplates[random.nextInt(descTemplates.length)] + "\n\n" +
                          "Key Responsibilities:\n" +
                          "- Collaborate with the team to achieve project goals.\n" +
                          "- Write clean, maintainable, and efficient work/code.\n" +
                          "- Participate in regular reviews and strategy sessions.\n\n" +
                          "Requirements:\n" +
                          "- Proven experience in the field.\n" +
                          "- Strong problem-solving skills.\n" +
                          "- Excellent communication and teamwork abilities.";
            job.setDescription(desc);
            
            job.setRecruiter(recruiters.get(random.nextInt(recruiters.size())));
            job.setVisible(true);

            jobsToSave.add(job);
        }

        jobRepository.saveAll(jobsToSave);
        System.out.println("Successfully seeded 70 dummy jobs!");
    }
}
